// Demo authentication for GitHub Pages
// This works without Supabase CORS issues

const DEMO_USERS_KEY = 'leadgen_lite_demo_users'
const CURRENT_USER_KEY = 'leadgen_lite_current_user'

export const demoAuth = {
  // Check if user is logged in
  getSession: () => {
    try {
      const sessionStr = localStorage.getItem(CURRENT_USER_KEY)
      if (!sessionStr) return { session: null }
      
      const session = JSON.parse(sessionStr)
      // Check if session is expired (24 hours)
      if (session.expiresAt && Date.now() > session.expiresAt) {
        localStorage.removeItem(CURRENT_USER_KEY)
        return { session: null }
      }
      
      return { session }
    } catch (err) {
      return { session: null }
    }
  },
  
  // Sign up with email/password
  signUp: async (email, password) => {
    // Simple validation
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address')
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    
    // Get existing users
    const usersStr = localStorage.getItem(DEMO_USERS_KEY) || '{}'
    const users = JSON.parse(usersStr)
    
    // Check if user exists
    if (users[email]) {
      throw new Error('User already exists')
    }
    
    // Create new user (in real app, hash password)
    users[email] = {
      email,
      password, // In real app, NEVER store plain passwords!
      createdAt: new Date().toISOString(),
      plan: 'free',
      userId: 'demo_' + Date.now() + Math.random().toString(36).substr(2, 9)
    }
    
    // Save users
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
    
    // Create session
    const session = {
      user: {
        id: users[email].userId,
        email: email,
        user_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      },
      expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      expiresAt: Date.now() + 86400000,
      access_token: 'demo_token_' + Math.random().toString(36).substr(2),
      refresh_token: 'demo_refresh_' + Math.random().toString(36).substr(2),
      token_type: 'bearer'
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session))
    
    return {
      data: {
        user: session.user,
        session
      },
      error: null
    }
  },
  
  // Sign in with email/password
  signInWithPassword: async (email, password) => {
    // Get users
    const usersStr = localStorage.getItem(DEMO_USERS_KEY) || '{}'
    const users = JSON.parse(usersStr)
    
    // Check credentials
    if (!users[email] || users[email].password !== password) {
      throw new Error('Invalid login credentials')
    }
    
    const user = users[email]
    
    // Create session
    const session = {
      user: {
        id: user.userId,
        email: email,
        user_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      },
      expires_at: Math.floor(Date.now() / 1000) + 86400,
      expiresAt: Date.now() + 86400000,
      access_token: 'demo_token_' + Math.random().toString(36).substr(2),
      refresh_token: 'demo_refresh_' + Math.random().toString(36).substr(2),
      token_type: 'bearer'
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session))
    
    return {
      data: {
        user: session.user,
        session
      },
      error: null
    }
  },
  
  // Sign out
  signOut: async () => {
    localStorage.removeItem(CURRENT_USER_KEY)
    return { error: null }
  },
  
  // Reset password (demo version)
  resetPasswordForEmail: async (email) => {
    // In real app, this would send an email
    // For demo, we'll just log it
    console.log(`Password reset requested for: ${email}`)
    
    // Get users
    const usersStr = localStorage.getItem(DEMO_USERS_KEY) || '{}'
    const users = JSON.parse(usersStr)
    
    if (!users[email]) {
      throw new Error('User not found')
    }
    
    // In real app: Send email with reset link
    // For demo: Return success
    return {
      data: {},
      error: null
    }
  },
  
  // Update password (demo version)
  updateUser: async (attributes) => {
    // For demo, we don't actually update anything
    // In real app, this would update user in database
    console.log('User update requested:', attributes)
    return {
      data: { user: null },
      error: null
    }
  },
  
  // Mock Supabase client methods
  auth: {
    getSession: () => demoAuth.getSession(),
    signUp: (credentials) => demoAuth.signUp(credentials.email, credentials.password),
    signInWithPassword: (credentials) => demoAuth.signInWithPassword(credentials.email, credentials.password),
    signOut: () => demoAuth.signOut(),
    onAuthStateChange: (callback) => {
      // Simple mock - call immediately with current session
      const { session } = demoAuth.getSession()
      callback('INITIAL_SESSION', session)
      
      // Listen for storage changes (other tabs)
      const handleStorage = (e) => {
        if (e.key === CURRENT_USER_KEY) {
          const { session: newSession } = demoAuth.getSession()
          callback('SIGNED_IN', newSession)
        }
      }
      window.addEventListener('storage', handleStorage)
      
      return {
        data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handleStorage) } }
      }
    }
  }
}

// Export as default Supabase-like client
export const demoSupabase = {
  auth: demoAuth.auth
}

export default demoSupabase