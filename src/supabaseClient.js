import { createClient } from '@supabase/supabase-js'
import { demoSupabase } from './demoAuth'

// Using Gary's existing Supabase project
const supabaseUrl = 'https://dylxoqnauorghuqehjnb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHhvcW5hdW9yZ2h1cWVoam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDcyMDgsImV4cCI6MjA4NTYyMzIwOH0.BNPdAtOmF-moWPq4p2zaQJd29mru1WiSbVe75bI5KGk'

// Check if we should use demo auth (for GitHub Pages CORS issues)
const shouldUseDemoAuth = () => {
  // Use demo auth if we're on GitHub Pages and Supabase fails
  if (typeof window !== 'undefined') {
    const isGitHubPages = window.location.hostname.includes('github.io')
    return isGitHubPages
  }
  return false
}

// Create real Supabase client
const realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    storage: {
      getItem: (key) => {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      },
      setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
      },
      removeItem: (key) => {
        localStorage.removeItem(key)
      }
    }
  }
})

// Test real Supabase connection
let useDemo = shouldUseDemoAuth()
const testConnection = async () => {
  try {
    // Quick test - try to get auth session
    const { data, error } = await realSupabase.auth.getSession()
    if (error && error.message.includes('Failed to fetch')) {
      console.log('Supabase CORS issue detected, using demo auth')
      useDemo = true
    } else {
      console.log('Supabase connected successfully')
      useDemo = false
    }
  } catch (err) {
    console.log('Supabase test failed, using demo auth:', err.message)
    useDemo = true
  }
}

// Run connection test
if (typeof window !== 'undefined') {
  testConnection()
}

// Export the appropriate client
export const supabase = useDemo ? demoSupabase : realSupabase

// Helper function to check if using real Supabase
export const isUsingRealSupabase = () => !useDemo

console.log('LeadGen Lite using:', useDemo ? 'Demo Auth' : 'Real Supabase')

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