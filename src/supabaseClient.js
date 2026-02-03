import { createClient } from '@supabase/supabase-js'

// Configuration
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const IS_DEVELOPMENT = !IS_PRODUCTION

// Use proxy in development, direct in production (if CORS configured)
const getSupabaseConfig = () => {
  if (typeof window === 'undefined') {
    return { url: '', key: '' }
  }
  
  // Check if we're on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io')
  
  if (isGitHubPages || IS_DEVELOPMENT) {
    // Use proxy for GitHub Pages (CORS issues)
    const proxyUrl = window.location.origin.includes('localhost') 
      ? 'http://localhost:3000/api/supabase'
      : `${window.location.origin}/api/supabase`
    
    return {
      url: proxyUrl,
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHhvcW5hdW9yZ2h1cWVoam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDcyMDgsImV4cCI6MjA4NTYyMzIwOH0.BNPdAtOmF-moWPq4p2zaQJd29mru1WiSbVe75bI5KGk'
    }
  } else {
    // Direct connection (Vercel, Netlify, etc.)
    return {
      url: 'https://dylxoqnauorghuqehjnb.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHhvcW5hdW9yZ2h1cWVoam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDcyMDgsImV4cCI6MjA4NTYyMzIwOH0.BNPdAtOmF-moWPq4p2zaQJd29mru1WiSbVe75bI5KGk'
    }
  }
}

const config = getSupabaseConfig()

// Create Supabase client
export const supabase = createClient(config.url, config.key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
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
  },
  global: {
    headers: {
      'X-Client-Info': 'leadgen-lite/1.0.0'
    }
  }
})

// Helper functions
export const isUsingProxy = () => {
  return config.url.includes('/api/supabase')
}

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
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
  console.log('LeadGen Lite Supabase config:', {
    usingProxy: isUsingProxy(),
    url: config.url.substring(0, 50) + '...',
    environment: IS_PRODUCTION ? 'production' : 'development'
  })
  
  // Test connection on load
  setTimeout(() => {
    testConnection()
  }, 1000)
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