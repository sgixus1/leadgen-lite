import { createClient } from '@supabase/supabase-js'

// Configuration
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const IS_DEVELOPMENT = !IS_PRODUCTION

// Configuration - use demo auth for GitHub Pages, real Supabase for other hosts
const getSupabaseConfig = () => {
  if (typeof window === 'undefined') {
    return { url: '', key: '', useDemo: true }
  }
  
  // Check environment
  const isLocalhost = window.location.hostname.includes('localhost')
  const isGitHubPages = window.location.hostname.includes('github.io')
  
  // For GitHub Pages, always use demo auth (no server for proxy)
  // For localhost with server running, use proxy
  // For other hosts (Vercel, Netlify), use direct if CORS configured
  
  if (isGitHubPages) {
    // GitHub Pages - use demo auth
    return { url: '', key: '', useDemo: true }
  } else if (isLocalhost) {
    // Local development - try proxy
    return {
      url: 'http://localhost:3000/api/supabase',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHhvcW5hdW9yZ2h1cWVoam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDcyMDgsImV4cCI6MjA4NTYyMzIwOH0.BNPdAtOmF-moWPq4p2zaQJd29mru1WiSbVe75bI5KGk',
      useDemo: false
    }
  } else {
    // Production (Vercel, Netlify, etc.) - use direct
    return {
      url: 'https://dylxoqnauorghuqehjnb.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHhvcW5hdW9yZ2h1cWVoam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDcyMDgsImV4cCI6MjA4NTYyMzIwOH0.BNPdAtOmF-moWPq4p2zaQJd29mru1WiSbVe75bI5KGk',
      useDemo: false
    }
  }
}

import { demoSupabase } from './demoAuth'

const config = getSupabaseConfig()

// Create real Supabase client if not using demo
let realSupabase = null
if (!config.useDemo && config.url) {
  realSupabase = createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: {
        getItem: (key) => {
          try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
          } catch (err) {
            console.error('Error parsing localStorage item:', err)
            return null
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, JSON.stringify(value))
          } catch (err) {
            console.error('Error saving to localStorage:', err)
          }
        },
        removeItem: (key) => {
          localStorage.removeItem(key)
        }
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'leadgen-lite/1.0.0'
      }
    }
  })
}

// Export the appropriate client
export const supabase = config.useDemo ? demoSupabase : realSupabase

// Helper functions
export const isUsingDemoAuth = () => config.useDemo
export const isUsingRealSupabase = () => !config.useDemo && realSupabase

export const testConnection = async () => {
  if (config.useDemo) {
    console.log('Using demo auth - no connection test needed')
    return true
  }
  
  try {
    const { data, error } = await realSupabase.auth.getSession()
    if (error) {
      console.error('Supabase connection test failed:', error.message)
      return false
    }
    console.log('Supabase connected successfully')
    return true
  } catch (err) {
    console.error('Supabase connection test error:', err)
    return false
  }
}

// Log configuration
if (typeof window !== 'undefined') {
  console.log('LeadGen Lite configuration:', {
    usingDemoAuth: config.useDemo,
    environment: IS_PRODUCTION ? 'production' : 'development',
    hostname: window.location.hostname,
    url: config.url ? config.url.substring(0, 50) + '...' : 'demo auth'
  })
  
  // Test connection on load (if using real Supabase)
  if (!config.useDemo) {
    setTimeout(() => {
      testConnection()
    }, 1000)
  }
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