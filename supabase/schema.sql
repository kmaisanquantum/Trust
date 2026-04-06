-- ============================================================
-- trust.dspng.tech — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  phone         TEXT,
  location      TEXT,
  is_verified   BOOLEAN DEFAULT FALSE,
  sevispass_id  TEXT UNIQUE,                  -- e.g. "SVS-2025-00142"
  seller_rating NUMERIC(3,2) DEFAULT 0,
  total_sales   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, sevispass_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'SVS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- LISTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL CHECK (category IN (
                    'electronics', 'vehicles', 'property', 
                    'agriculture', 'clothing', 'services', 'other'
                  )),
  price           NUMERIC(12,2) NOT NULL,
  currency        TEXT DEFAULT 'PGK',
  condition       TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'parts_only')),
  location        TEXT,
  images          TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT TRUE,
  is_featured     BOOLEAN DEFAULT FALSE,
  view_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS listings_seller_id_idx ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS listings_category_idx ON public.listings(category);
CREATE INDEX IF NOT EXISTS listings_is_active_idx ON public.listings(is_active);

-- ============================================================
-- ESCROW TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id          UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  buyer_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  seller_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  amount              NUMERIC(12,2) NOT NULL,
  currency            TEXT DEFAULT 'PGK',
  platform_fee        NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(amount * 0.025, 2)) STORED,
  seller_payout       NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(amount * 0.975, 2)) STORED,
  
  -- Status flow: pending -> held -> in_transit -> completed | disputed | refunded
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                        'pending', 'held', 'in_transit', 'completed', 'disputed', 'refunded', 'cancelled'
                      )),
  
  -- QR code payload (signed token for delivery scan)
  qr_token            TEXT UNIQUE,
  qr_expires_at       TIMESTAMPTZ,
  
  -- Payment metadata (mock for now — real: BSP Bank / BRED PNG)
  payment_reference   TEXT,
  payment_method      TEXT DEFAULT 'bank_transfer',
  
  -- Timestamps
  held_at             TIMESTAMPTZ,
  shipped_at          TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  disputed_at         TIMESTAMPTZ,
  
  -- Dispute
  dispute_reason      TEXT,
  dispute_resolved_by UUID REFERENCES public.profiles(id),
  
  -- Delivery details
  delivery_address    TEXT,
  delivery_notes      TEXT,
  tracking_number     TEXT,
  
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS escrow_buyer_id_idx ON public.escrow_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS escrow_seller_id_idx ON public.escrow_transactions(seller_id);
CREATE INDEX IF NOT EXISTS escrow_status_idx ON public.escrow_transactions(status);
CREATE INDEX IF NOT EXISTS escrow_qr_token_idx ON public.escrow_transactions(qr_token);

-- ============================================================
-- TRANSACTION AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transaction_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id  UUID NOT NULL REFERENCES public.escrow_transactions(id) ON DELETE CASCADE,
  actor_id        UUID REFERENCES public.profiles(id),
  event_type      TEXT NOT NULL,   -- 'payment_held', 'qr_scanned', 'funds_released', etc.
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER escrow_updated_at BEFORE UPDATE ON public.escrow_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users see their own, everyone sees verified sellers
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: anyone can view active, sellers manage their own
CREATE POLICY "Anyone can view active listings" ON public.listings FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers can manage own listings" ON public.listings FOR ALL USING (auth.uid() = seller_id);

-- Escrow: only parties involved
CREATE POLICY "Parties can view their transactions" ON public.escrow_transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can create transactions" ON public.escrow_transactions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Parties can update their transactions" ON public.escrow_transactions
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Events: parties can view
CREATE POLICY "Parties can view events" ON public.transaction_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.escrow_transactions t
      WHERE t.id = transaction_id AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
    )
  );

-- ============================================================
-- SEED: Demo listings (run after creating a test user)
-- ============================================================
-- INSERT INTO public.listings (seller_id, title, description, category, price, condition, location)
-- VALUES 
--   ('<your-user-id>', 'Toyota Landcruiser 200 Series', '2019 model, diesel, well maintained', 'vehicles', 185000, 'good', 'Port Moresby'),
--   ('<your-user-id>', 'Solar Panel Kit 2kW', 'Complete off-grid system with batteries', 'electronics', 8500, 'new', 'Lae'),
--   ('<your-user-id>', '5 Acres Agricultural Land', 'Highlands region, fertile soil', 'agriculture', 45000, 'new', 'Mt Hagen');
