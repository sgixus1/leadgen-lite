import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState([])
  const [leads, setLeads] = useState([])
  const [userPlan, setUserPlan] = useState('free')

  useEffect(() => {
    fetchData()
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
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const createNewPage = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_pages')
        .insert([{
          user_id: session.user.id,
          title: 'New Lead Page',
          slug: `page-${Date.now()}`,
          template: 'basic',
          content: { blocks: [] },
          published: false
        }])
        .select()
        .single()

      if (error) throw error
      setPages([data, ...pages])
    } catch (error) {
      alert('Error creating page: ' + error.message)
    }
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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '24px', color: '#666' }}>Loading your dashboard...</div>
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
            onClick={createNewPage}
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
            + Create New Lead Page
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
            padding: '40px', 
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📄</div>
            <h4 style={{ margin: '0 0 10px 0' }}>No lead pages yet</h4>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Create your first lead page to start capturing leads
            </p>
            <button
              onClick={createNewPage}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Create Your First Page
            </button>
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
    </div>
  )
}