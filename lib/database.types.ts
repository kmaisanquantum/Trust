export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          location: string | null
          is_verified: boolean
          sevispass_id: string | null
          seller_rating: number
          total_sales: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      listings: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string | null
          category: 'electronics' | 'vehicles' | 'property' | 'agriculture' | 'clothing' | 'services' | 'other'
          price: number
          currency: string
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'parts_only' | null
          location: string | null
          images: string[]
          is_active: boolean
          is_featured: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['listings']['Row'], 'id' | 'view_count' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['listings']['Insert']>
      }
      escrow_transactions: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          seller_id: string
          amount: number
          currency: string
          platform_fee: number
          seller_payout: number
          status: 'pending' | 'held' | 'in_transit' | 'completed' | 'disputed' | 'refunded' | 'cancelled'
          qr_token: string | null
          qr_expires_at: string | null
          payment_reference: string | null
          payment_method: string
          held_at: string | null
          shipped_at: string | null
          delivered_at: string | null
          completed_at: string | null
          disputed_at: string | null
          dispute_reason: string | null
          dispute_resolved_by: string | null
          delivery_address: string | null
          delivery_notes: string | null
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['escrow_transactions']['Row'], 'id' | 'platform_fee' | 'seller_payout' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['escrow_transactions']['Insert']>
      }
      transaction_events: {
        Row: {
          id: string
          transaction_id: string
          actor_id: string | null
          event_type: string
          metadata: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transaction_events']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Listing = Database['public']['Tables']['listings']['Row']
export type EscrowTransaction = Database['public']['Tables']['escrow_transactions']['Row']
export type TransactionEvent = Database['public']['Tables']['transaction_events']['Row']
