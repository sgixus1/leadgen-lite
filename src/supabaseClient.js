import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your Supabase project URL and anon key
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema for LeadGen Lite:
/*
1. users (handled by Supabase Auth)
2. subscriptions
   - id (uuid)
   - user_id (references auth.users)
   - plan (free|starter|pro|agency)
   - status (active|canceled|past_due)
   - stripe_subscription_id
   - current_period_start
   - current_period_end
   - created_at
3. lead_pages
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
4. leads
   - id (uuid)
   - page_id
   - user_id
   - email
   - name
   - metadata (JSON)
   - created_at
5. email_sequences
   - id (uuid)
   - user_id
   - name
   - steps (JSON)
   - active
   - created_at
*/