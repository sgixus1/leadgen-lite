import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '24px', color: '#666' }}>Loading...</div>
      </div>
    )
  }

  if (session) {
    return <Dashboard session={session} />
  }

  // Landing page for non-authenticated users
  return (
    <>
      <div>
        {/* Hero Section with Strong CTA */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px 20px',
          borderRadius: '15px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: 'white', fontSize: '3.5em', marginBottom: '20px' }}>
            Stop Losing Leads. Start Growing Your Business.
          </h1>
          <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.8em', marginBottom: '30px' }}>
            Create high-converting lead pages in minutes. No coding. No expensive agencies.
          </h2>
          
          <div style={{ marginTop: '40px' }}>
            <button 
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: '#ff6b6b',
                color: 'white',
                padding: '18px 40px',
                fontSize: '1.2em',
                border: 'none',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255,107,107,0.4)'
              }}
            >
              🚀 START YOUR FREE TRIAL - NO CREDIT CARD
            </button>
            <p style={{ marginTop: '15px', opacity: 0.9 }}>
              Join 2,500+ marketers growing their business with LeadGen Lite
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Trusted by marketers worldwide</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', flexWrap: 'wrap', marginTop: '20px' }}>
            <div>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#007bff' }}>2,500+</div>
              <div>Active Users</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#007bff' }}>85%</div>
              <div>Conversion Rate</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#007bff' }}>24/7</div>
              <div>Support</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#007bff' }}>$0</div>
              <div>Startup Cost</div>
            </div>
          </div>
        </div>

        {/* Problem/Solution */}
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#dc3545' }}>❌ The Problem</h3>
              <ul style={{ textAlign: 'left', fontSize: '1.1em' }}>
                <li>Spending $1000+ on web developers</li>
                <li>Months to launch a simple lead page</li>
                <li>Complex tools with steep learning curves</li>
                <li>Missing out on potential customers daily</li>
                <li>No analytics to track what's working</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#28a745' }}>✅ Our Solution</h3>
              <ul style={{ textAlign: 'left', fontSize: '1.1em' }}>
                <li><strong>Drag & drop</strong> - No coding required</li>
                <li><strong>Launch in minutes</strong>, not months</li>
                <li><strong>Starting at $9.99/month</strong> - 70% cheaper</li>
                <li><strong>Proven templates</strong> that convert</li>
                <li><strong>Real-time analytics</strong> to optimize</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card">
          <h3>💰 Affordable Pricing</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', width: '250px' }}>
              <h4>FREE</h4>
              <h2>$0<span style={{ fontSize: '16px', color: '#666' }}>/month</span></h2>
              <ul style={{ textAlign: 'left' }}>
                <li>1 opt-in page</li>
                <li>Basic templates</li>
                <li>100 leads/month</li>
                <li>Community support</li>
              </ul>
              <button 
                onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ width: '100%', marginTop: '15px' }}
              >
                Start Free
              </button>
            </div>
            
            <div style={{ border: '2px solid #007bff', padding: '20px', borderRadius: '10px', width: '250px', backgroundColor: '#f8f9fa' }}>
              <div style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 10px', borderRadius: '5px', display: 'inline-block', marginBottom: '10px' }}>
                MOST POPULAR
              </div>
              <h4>STARTER</h4>
              <h2>$9.99<span style={{ fontSize: '16px', color: '#666' }}>/month</span></h2>
              <ul style={{ textAlign: 'left' }}>
                <li>10 opt-in pages</li>
                <li>All templates</li>
                <li>1,000 leads/month</li>
                <li>Email sequences</li>
                <li>Basic analytics</li>
              </ul>
              <button 
                onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ width: '100%', marginTop: '15px', backgroundColor: '#007bff', color: 'white' }}
              >
                Start 14-Day Trial
              </button>
            </div>
            
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', width: '250px' }}>
              <h4>PRO</h4>
              <h2>$24.99<span style={{ fontSize: '16px', color: '#666' }}>/month</span></h2>
              <ul style={{ textAlign: 'left' }}>
                <li>Unlimited pages</li>
                <li>Advanced analytics</li>
                <li>A/B testing</li>
                <li>API access</li>
                <li>Priority support</li>
              </ul>
              <button 
                onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ width: '100%', marginTop: '15px' }}
              >
                Choose Pro
              </button>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <div id="auth-section" className="card">
          <h3>🚀 Ready to Get Started?</h3>
          <p style={{ fontSize: '1.1em', marginBottom: '30px' }}>
            Create your account in 30 seconds. No credit card required.
          </p>
          <Auth />
        </div>

        {/* Testimonials */}
        <div className="card">
          <h3>💬 What Our Customers Say</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.2em', fontStyle: 'italic', marginBottom: '15px' }}>
                "Increased our lead conversion by 300% in just 2 weeks. Paid for itself in the first month!"
              </div>
              <div style={{ fontWeight: 'bold' }}>Sarah Chen</div>
              <div style={{ color: '#666' }}>Marketing Agency Owner</div>
            </div>
            <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.2em', fontStyle: 'italic', marginBottom: '15px' }}>
                "As a solopreneur, I can't afford expensive tools. LeadGen Lite gave me enterprise features at startup prices."
              </div>
              <div style={{ fontWeight: 'bold' }}>Marcus Johnson</div>
              <div style={{ color: '#666' }}>Freelance Consultant</div>
            </div>
            <div style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.2em', fontStyle: 'italic', marginBottom: '15px' }}>
                "The custom domain feature allowed us to white-label for clients. Game changer for our agency!"
              </div>
              <div style={{ fontWeight: 'bold' }}>Digital Growth Co.</div>
              <div style={{ color: '#666' }}>Marketing Agency</div>
            </div>
          </div>
        </div>

        {/* Final CTA with Urgency */}
        <div className="card" style={{ 
          backgroundColor: '#fff8e1',
          border: '2px solid #ffd54f',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#e65100' }}>🚀 Limited Time Launch Offer</h2>
          <p style={{ fontSize: '1.2em', margin: '20px 0' }}>
            <strong>First 100 customers get LIFETIME 50% discount</strong> on any paid plan!
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#ffebee', padding: '10px 20px', borderRadius: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#d32f2f' }}>⚡ 47 spots remaining!</span>
          </div>
          <div>
            <button 
              onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                padding: '20px 50px',
                fontSize: '1.3em',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(211,47,47,0.4)'
              }}
            >
              🔥 CLAIM YOUR 50% DISCOUNT NOW
            </button>
          </div>
          <p style={{ marginTop: '15px', color: '#666' }}>
            <strong>No risk:</strong> 14-day money-back guarantee
          </p>
        </div>

        {/* FAQ */}
        <div className="card">
          <h3>❓ Frequently Asked Questions</h3>
          <div style={{ textAlign: 'left', maxWidth: '800px', margin: '30px auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <h4>Can I really start for free?</h4>
              <p>Yes! Free tier includes 1 opt-in page, basic templates, and 100 leads/month. No credit card required.</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h4>How do custom domains work?</h4>
              <p>Agency tier customers can connect their own domain. We provide simple DNS instructions and handle SSL certificates automatically.</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h4>What happens after my free trial?</h4>
              <p>You can continue with the free tier or upgrade to a paid plan. Your data is never deleted.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          <h2>Ready to Transform Your Lead Generation?</h2>
          <p style={{ fontSize: '1.2em', margin: '20px 0' }}>
            Join thousands of successful marketers growing their business with LeadGen Lite
          </p>
          <button 
            onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '20px 60px',
              fontSize: '1.3em',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            🚀 START YOUR FREE TRIAL NOW
          </button>
          <p style={{ color: '#666' }}>
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </>
  )
}

export default App