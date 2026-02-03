import { useState } from 'react'

export default function QuickStartWizard({ onComplete, onSkip }) {
  const [step, setStep] = useState(1)
  const [pageTitle, setPageTitle] = useState('')
  const [template, setTemplate] = useState('basic')
  const [goal, setGoal] = useState('email-list')

  const templates = [
    { id: 'basic', name: 'Basic Opt-in', description: 'Simple email capture', icon: '📧' },
    { id: 'webinar', name: 'Webinar Registration', description: 'Promote your webinar', icon: '🎥' },
    { id: 'ebook', name: 'E-book Download', description: 'Lead magnet delivery', icon: '📚' },
    { id: 'consultation', name: 'Free Consultation', description: 'Book discovery calls', icon: '📅' }
  ]

  const goals = [
    { id: 'email-list', name: 'Build Email List', description: 'Grow your subscriber base' },
    { id: 'sales', name: 'Generate Sales', description: 'Direct product/service sales' },
    { id: 'book-calls', name: 'Book Calls', description: 'Schedule consultations' },
    { id: 'content', name: 'Content Delivery', description: 'Share lead magnets' }
  ]

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Complete the wizard
      const pageData = {
        title: pageTitle || 'My First Lead Page',
        template,
        goal,
        createdAt: new Date().toISOString()
      }
      onComplete(pageData)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
            <h3 style={{ margin: '0 0 15px 0' }}>Create Your First Lead Page in 60 Seconds!</h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Follow these 4 simple steps. You'll have a live page capturing leads before you know it!
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '10px',
              marginBottom: '30px'
            }}>
              {[1, 2, 3, 4].map((num) => (
                <div key={num} style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: step >= num ? '#007bff' : '#e9ecef',
                  color: step >= num ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600'
                }}>
                  {num}
                </div>
              ))}
            </div>
            <button
              onClick={handleNext}
              style={{
                padding: '15px 40px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Let's Get Started! →
            </button>
          </div>
        )

      case 2:
        return (
          <div>
            <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>What's Your Page About?</h3>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px' }}>
              Give your page a clear, compelling title
            </p>
            <div style={{ marginBottom: '30px' }}>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="e.g., 'Free Marketing Strategy Guide'"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  outline: 'none'
                }}
                autoFocus
              />
              <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Tip: Be specific about what visitors will get
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!pageTitle.trim()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: pageTitle.trim() ? '#007bff' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: pageTitle.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Next: Choose Template →
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div>
            <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Choose a Template</h3>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px' }}>
              Pick the design that fits your goal
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px',
              marginBottom: '30px'
            }}>
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  style={{
                    padding: '20px',
                    border: template === t.id ? '2px solid #007bff' : '1px solid #e9ecef',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: template === t.id ? '#f0f8ff' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{t.icon}</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>{t.name}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{t.description}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Next: Set Goal →
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div>
            <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>What's Your Goal?</h3>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '30px' }}>
              This helps us optimize your page for results
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px',
              marginBottom: '30px'
            }}>
              {goals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  style={{
                    padding: '20px',
                    border: goal === g.id ? '2px solid #28a745' : '1px solid #e9ecef',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: goal === g.id ? '#f0fff4' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>{g.name}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{g.description}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🎉 Create My Page!
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
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
      zIndex: 1001,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        <button
          onClick={onSkip}
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
        
        {getStepContent()}
        
        {step > 1 && (
          <div style={{
            textAlign: 'center',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #e9ecef'
          }}>
            <button
              onClick={onSkip}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Skip wizard and create basic page
            </button>
          </div>
        )}
      </div>
    </div>
  )
}