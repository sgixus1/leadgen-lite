// Production server for LeadGen Lite
// Solves CORS issues with Supabase on GitHub Pages

import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')))

// Supabase proxy to handle CORS
app.use('/api/supabase', createProxyMiddleware({
  target: 'https://dylxoqnauorghuqehjnb.supabase.co',
  changeOrigin: true,
  pathRewrite: {
    '^/api/supabase': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    // Forward Supabase API key
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHhvcW5hdW9yZ2h1cWVoam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDcyMDgsImV4cCI6MjA4NTYyMzIwOH0.BNPdAtOmF-moWPq4p2zaQJd29mru1WiSbVe75bI5KGk'
    proxyReq.setHeader('apikey', apiKey)
    
    // Forward authorization header if present
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization)
    }
    
    // Forward content-type
    if (req.headers['content-type']) {
      proxyReq.setHeader('Content-Type', req.headers['content-type'])
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey')
  }
}))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'leadgen-lite',
    timestamp: new Date().toISOString(),
    supabase: 'connected'
  })
})

// Test Supabase connection
app.get('/api/test-supabase', async (req, res) => {
  try {
    const response = await fetch('https://dylxoqnauorghuqehjnb.supabase.co/auth/v1/settings', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHhvcW5hdW9yZ2h1cWVoam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDcyMDgsImV4cCI6MjA4NTYyMzIwOH0.BNPdAtOmF-moWPq4p2zaQJd29mru1WiSbVe75bI5KGk'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      res.json({
        success: true,
        message: 'Supabase connected successfully',
        data: data
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Supabase connection failed',
        error: await response.text()
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Supabase test failed',
      error: error.message
    })
  }
})

// Handle SPA routing - all other routes go to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`🚀 LeadGen Lite server running on port ${PORT}`)
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`)
  console.log(`🔗 Supabase proxy: http://localhost:${PORT}/api/supabase/*`)
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🧪 Supabase test: http://localhost:${PORT}/api/test-supabase`)
  console.log(`🌐 Open in browser: http://localhost:${PORT}`)
})

export default app