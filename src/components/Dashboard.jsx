import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import QuickStartWizard from './QuickStartWizard'

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState([])
  const [leads, setLeads] = useState([])
  const [userPlan, setUserPlan] = useState('free')
  const [showWelcome, setShowWelcome] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [userProgress, setUserProgress] = useState({
    firstPageCreated: false,
    firstLeadCaptured: false,
    pagesCreated: 0,
    leadsCaptured: 0
  })

  useEffect(() => {
    fetchData()
    
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('leadgen_lite_user_progress')
    if (savedProgress) {
      try {
        setUserProgress(JSON.parse(savedProgress))
      } catch (err) {
        console.error('Error parsing user progress:', err)
      }
    }
  }, [session])

  const fetchData = async () => {
    try {
      // Fetch user's lead pages
      const { data: pagesData } = await supabase
        .from('lead_pages')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      // Fetch user's leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch user's subscription plan
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single()

      setPages(pagesData || [])
      setLeads(leadsData || [])
      setUserPlan(subscriptionData?.plan || 'free')
      setLoading(false)
      
      // Show welcome message for first-time users (no pages yet)
      if (!pagesData || pagesData.length === 0) {
        // Check if we've shown welcome before
        const hasSeenWelcome = localStorage.getItem('leadgen_lite_welcome_seen')
        if (!hasSeenWelcome) {
          setTimeout(() => {
            setShowWelcome(true)
            localStorage.setItem('leadgen_lite_welcome_seen', 'true')
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const createNewPage = async (pageData = null) => {
    try {
      const pageTitle = pageData?.title || 'New Lead Page'
      const template = pageData?.template || 'basic'
      
      const { data, error } = await supabase
        .from('lead_pages')
        .insert([{
          user_id: session.user.id,
          title: pageTitle,
          slug: `page-${Date.now()}`,
          template: template,
          content: { blocks: [] },
          published: false,
          goal: pageData?.goal || 'email-list'
        }])
        .select()
        .single()

      if (error) throw error
      
      // Update user progress
      const newProgress = {
        ...userProgress,
        firstPageCreated: true,
        pagesCreated: userProgress.pagesCreated + 1
      }
      setUserProgress(newProgress)
      localStorage.setItem('leadgen_lite_user_progress', JSON.stringify(newProgress))
      
      setPages([data, ...pages])
      
      // Show success message
      alert(`🎉 Success! Your page "${pageTitle}" has been created!`)
      
      return data
    } catch (error) {
      alert('Error creating page: ' + error.message)
      return null
    }
  }

  const handleWizardComplete = async (pageData) => {
    setShowWizard(false)
    const createdPage = await createNewPage(pageData)
    if (createdPage) {
      // Track wizard completion
      localStorage.setItem('leadgen_lite_wizard_completed', 'true')
    }
  }

  const handleWizardSkip = () => {
    setShowWizard(false)
    createNewPage()
  }

  const getPlanLimits = () => {
    const limits = {
      free: { pages: 1, leads: 100, features: ['Basic templates'] },
      starter: { pages: 10, leads: 1000, features: ['All templates', 'Email sequences', 'Basic analytics'] },
      pro: { pages: Infinity, leads: Infinity, features: ['Unlimited pages', 'Advanced analytics', 'A/B testing', 'API access'] },
      agency: { pages: Infinity, leads: Infinity, features: ['White label', 'Custom domains', 'Team members', 'Priority support'] }
    }
    return limits[userPlan] || limits.free
  }

  const planLimits = getPlanLimits()

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '80px 20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '20px',
          animation: 'pulse 1.5s infinite'
        }}>⚡</div>
        <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Preparing Your Command Center</h3>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Loading your lead pages, analytics, and growth tools...
        </p>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#e9ecef',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '60%',
            height: '100%',
            backgroundColor: '#007bff',
            borderRadius: '3px',
            animation: 'loading 1.5s ease-in-out infinite'
          }}></div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee'
      }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Welcome back, {session.user.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: userPlan === 'free' ? '#6c757d' : 
                           userPlan === 'starter' ? '#28a745' : 
                           userPlan === 'pro' ? '#007bff' : '#6f42c1',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* User Progress (only show for new users) */}
      {pages.length === 0 && !userProgress.firstPageCreated && (
        <div style={{ 
          backgroundColor: '#fff8e1',
          border: '2px solid #ffd54f',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#e65100' }}>🎯 Your First Lead Page Awaits!</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            <strong>Complete your onboarding:</strong> Create your first page → Customize → Publish → Capture leads!
          </p>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#ffeaa7',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '25%',
              height: '100%',
              backgroundColor: '#fdcb6e',
              borderRadius: '5px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Progress: 25% (Step 1 of 4)
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Lead Pages</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{pages.length}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {planLimits.pages === Infinity ? 'Unlimited' : `${pages.length}/${planLimits.pages}`}
          </div>
          {pages.length === 0 && (
            <div style={{ fontSize: '12px', color: '#28a745', marginTop: '5px' }}>
              ⚡ Create your first page to get started!
            </div>
          )}
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Leads</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{leads.length}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {planLimits.leads === Infinity ? 'Unlimited' : `${leads.length}/${planLimits.leads}`}
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Conversion Rate</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {pages.length > 0 ? '12.5%' : '0%'}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Last 30 days</div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Plan Features</div>
          <div style={{ fontSize: '14px' }}>
            {planLimits.features.slice(0, 2).map((feature, i) => (
              <div key={i} style={{ marginBottom: '3px' }}>✓ {feature}</div>
            ))}
            {planLimits.features.length > 2 && (
              <div style={{ color: '#666' }}>+{planLimits.features.length - 2} more</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              // Check if user has completed wizard before
              const hasCompletedWizard = localStorage.getItem('leadgen_lite_wizard_completed')
              if (!hasCompletedWizard && pages.length === 0) {
                setShowWizard(true)
              } else {
                createNewPage()
              }
            }}
            disabled={pages.length >= planLimits.pages && planLimits.pages !== Infinity}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: pages.length >= planLimits.pages && planLimits.pages !== Infinity ? 'not-allowed' : 'pointer',
              opacity: pages.length >= planLimits.pages && planLimits.pages !== Infinity ? 0.5 : 1
            }}
          >
            {pages.length === 0 ? '🚀 Create First Lead Page' : '+ Create New Lead Page'}
          </button>
          
          <button
            onClick={() => alert('Coming soon!')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📧 Create Email Sequence
          </button>

          <button
            onClick={() => alert('Coming soon!')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📊 View Analytics
          </button>

          {userPlan !== 'agency' && (
            <button
              onClick={() => window.open('/#pricing', '_blank')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ffc107',
                color: '#212529',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ⚡ Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* Recent Pages */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Your Lead Pages</h3>
          <button
            onClick={() => alert('View all pages')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            View All
          </button>
        </div>

        {pages.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '50px 30px', 
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            border: '2px dashed #e9ecef'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
            <h3 style={{ margin: '0 0 15px 0', color: '#212529' }}>Welcome to Your Lead Generation Hub!</h3>
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '16px', maxWidth: '600px', margin: '0 auto 25px' }}>
              <strong>You're 3 minutes away from capturing your first lead!</strong> Create a high-converting page, share the link, and watch leads roll in.
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px', 
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>1️⃣</div>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>Create Page</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Choose a template and customize</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>2️⃣</div>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>Share Link</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Add to emails, social media, ads</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>3️⃣</div>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>Capture Leads</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Emails automatically saved here</div>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => {
                  const hasCompletedWizard = localStorage.getItem('leadgen_lite_wizard_completed')
                  if (!hasCompletedWizard) {
                    setShowWizard(true)
                  } else {
                    createNewPage()
                  }
                }}
                style={{
                  padding: '15px 40px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(0,123,255,0.3)'
                }}
              >
                🚀 Launch Your First Lead Page
              </button>
              <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                <strong>Free plan includes:</strong> 1 page • 100 leads/month • Basic templates
              </p>
            </div>
          </div>
        ) : (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Page Title</th>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Leads</th>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Created</th>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.slice(0, 5).map((page) => (
                  <tr key={page.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: '500' }}>{page.title}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>{page.slug}</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: '500' }}>{page.conversions || 0}</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: page.published ? '#d4edda' : '#fff3cd',
                        color: page.published ? '#155724' : '#856404'
                      }}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#666' }}>
                      {new Date(page.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button
                        onClick={() => alert(`Edit page: ${page.id}`)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => alert(`View page: ${page.id}`)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Leads */}
      {leads.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Recent Leads</h3>
            <button
              onClick={() => alert('View all leads')}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              View All
            </button>
          </div>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Page</th>
                  <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #eee' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>{lead.email}</td>
                    <td style={{ padding: '15px' }}>{lead.name || '—'}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        backgroundColor: '#e9ecef', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        Page #{lead.page_id?.substring(0, 8) || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#666' }}>
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Welcome Modal for First-Time Users */}
      {showWelcome && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ margin: '0 0 15px 0', color: '#212529' }}>Welcome to LeadGen Lite!</h2>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                You're about to start capturing leads like a pro. Here's how to get started in 3 simple steps:
              </p>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Create Your First Lead Page</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Click the "Create New Lead Page" button above</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Customize & Publish</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Edit your page, then publish to get a shareable link</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Share & Capture Leads</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Add the link to your emails, social media, or ads</div>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => {
                  setShowWelcome(false)
                  createNewPage()
                }}
                style={{
                  padding: '15px 40px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '15px'
                }}
              >
                🚀 Create My First Page
              </button>
              <div>
                <button
                  onClick={() => setShowWelcome(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  I'll explore first
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Start Wizard */}
      {showWizard && (
        <QuickStartWizard
          onComplete={handleWizardComplete}
          onSkip={handleWizardSkip}
        />
      )}
    </div>
  )
}