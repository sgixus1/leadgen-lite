import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your Supabase project URL and anon key
// For development, we'll use environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key'
}

// Database schema for LeadGen Lite (for reference):
/*
Tables needed:
1. subscriptions
   - id (uuid)
   - user_id (references auth.users)
   - plan (free|starter|pro|agency)
   - status (active|canceled|past_due)
   - stripe_subscription_id
   - current_period_start
   - current_period_end
   - created_at
2. lead_pages
   - id (uuid)
   - user_id
   - title
   - slug
   - template
   - content (JSON)
   - published (boolean)
   - views
   - conversions
   - created_at
   - updated_at
3. leads
   - id (uuid)
   - page_id
   - user_id
   - email
   - name
   - metadata (JSON)
   - created_at
4. email_sequences
   - id (uuid)
   - user_id
   - name
   - steps (JSON)
   - active
   - created_at
5. custom_domains
   - id (uuid)
   - user_id
   - domain
   - status (pending|active|failed)
   - verification_token
   - verified_at
   - ssl_certificate (JSON)
   - created_at
*/