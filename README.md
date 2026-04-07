# Trust — Verified PNG Marketplace

Papua New Guinea's trusted marketplace with SevisPass digital identity and escrow-protected payments.

## Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Deployment**: Render.com (Node.js Web Service)

---

## Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd trust-dspng
npm install
```

### 2. Set Up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql` in full
3. Copy your project URL and keys

### 3. Configure Env
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Run Locally
```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy to Render.com

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml`
5. Set these **Environment Variables** in Render dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` ← Mark as **Secret**
6. Deploy!

**Build Command**: `npm install; npm run build`  
**Start Command**: `npm run start`

---

## Architecture

```
app/
├── page.tsx                  # Landing page
├── auth/
│   ├── login/page.tsx        # SevisPass login
│   ├── register/page.tsx     # 2-step registration + SevisPass ID
│   └── callback/route.ts     # Supabase OAuth callback
├── dashboard/page.tsx        # Seller dashboard (listings + escrow + profile)
├── listings/
│   ├── page.tsx              # Public marketplace browse
│   └── new/page.tsx          # Create listing
├── escrow/
│   ├── new/page.tsx          # Create escrow transaction (3-step)
│   ├── [id]/page.tsx         # Transaction detail + timeline
│   ├── [id]/qr/page.tsx      # QR code generator for delivery
│   └── verify/page.tsx       # Buyer scan landing page
└── api/
    ├── health/route.ts       # Render health check
    ├── escrow/
    │   ├── generate-qr/      # POST: generate QR token
    │   └── verify/           # POST: verify QR → release funds

supabase/
└── schema.sql                # Full DB schema + RLS policies

lib/
├── supabase.ts               # Client + server Supabase instances
├── database.types.ts         # TypeScript types from schema
└── escrow.ts                 # QR token generation + helpers
```

## Escrow Flow

```
Buyer pays → Funds held in escrow
     ↓
Seller ships item
     ↓
Seller generates QR code (5 min expiry)
     ↓
Buyer scans QR on delivery
     ↓
Funds released to seller (seller gets 97.5%, 2.5% platform fee)
```

## SevisPass (Mock)
SevisPass is a digital ID based on PNG National ID number. In this demo:
- Registration collects NID number (mock — not verified against a real DB)
- A `SVS-YYYY-XXXXX` ID is generated and stored in `profiles.sevispass_id`
- In production: integrate with PNG Civil Registration Authority API

## Supabase Tables
| Table | Purpose |
|---|---|
| `profiles` | Extends auth.users with SevisPass ID, ratings |
| `listings` | Marketplace listings with category, price, images |
| `escrow_transactions` | Full escrow lifecycle with QR token management |
| `transaction_events` | Immutable audit log of every state change |
