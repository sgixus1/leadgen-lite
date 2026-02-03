// Magic Page Generator for Lazy Users
// Creates perfect pages with ZERO effort

export class MagicPageGenerator {
  // Generate page title based on email
  static generateTitleFromEmail(email) {
    const domain = email.split('@')[1]?.split('.')[0] || 'business'
    const name = email.split('@')[0]
    
    const industries = {
      'gmail': 'Personal',
      'yahoo': 'Personal',
      'outlook': 'Professional',
      'hotmail': 'Personal',
      'company': 'Corporate',
      'business': 'Business',
      'consulting': 'Consulting',
      'agency': 'Agency',
      'marketing': 'Marketing',
      'tech': 'Technology',
      'digital': 'Digital',
      'creative': 'Creative'
    }
    
    const industry = industries[domain] || 'Professional'
    
    const templates = [
      `Free ${industry} Strategy Guide`,
      `Exclusive ${industry} Insights`,
      `${industry} Success Toolkit`,
      `Ultimate ${industry} Checklist`,
      `${industry} Growth Blueprint`,
      `Pro ${industry} Templates`,
      `${industry} Masterclass Access`,
      `${name}'s ${industry} Resources`
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  // Generate slug from title
  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)
  }
  
  // Determine best template based on email pattern
  static determineTemplate(email) {
    const domain = email.split('@')[1] || ''
    
    if (domain.includes('consult') || domain.includes('coach') || domain.includes('advisor')) {
      return 'consultation' // Free consultation
    } else if (domain.includes('edu') || domain.includes('learn') || domain.includes('academy')) {
      return 'ebook' // E-book download
    } else if (domain.includes('event') || domain.includes('webinar') || domain.includes('meet')) {
      return 'webinar' // Webinar registration
    } else {
      return 'basic' // Basic opt-in (most common)
    }
  }
  
  // Determine goal based on email
  static determineGoal(email) {
    const domain = email.split('@')[1] || ''
    
    if (domain.includes('sales') || domain.includes('shop') || domain.includes('store')) {
      return 'sales'
    } else if (domain.includes('book') || domain.includes('schedule') || domain.includes('meet')) {
      return 'book-calls'
    } else if (domain.includes('content') || domain.includes('media') || domain.includes('publish')) {
      return 'content'
    } else {
      return 'email-list' // Default
    }
  }
  
  // Generate pre-filled content based on template
  static generateContent(template, title) {
    const baseContent = {
      blocks: [],
      settings: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        buttonColor: '#007bff',
        fontFamily: 'Inter, sans-serif'
      }
    }
    
    switch (template) {
      case 'basic':
        baseContent.blocks = [
          {
            type: 'hero',
            title: title,
            subtitle: 'Get instant access to exclusive content that will transform your approach',
            buttonText: 'Get Free Access',
            imageUrl: null
          },
          {
            type: 'benefits',
            items: [
              'Proven strategies that work',
              'Step-by-step guidance',
              'Immediate actionable insights',
              'Community access'
            ]
          },
          {
            type: 'form',
            fields: ['email', 'name'],
            submitText: 'Send My Free Guide'
          }
        ]
        break
        
      case 'webinar':
        baseContent.blocks = [
          {
            type: 'hero',
            title: `Reserve Your Spot: ${title}`,
            subtitle: 'Join industry experts for this exclusive live training session',
            buttonText: 'Register Now',
            imageUrl: null
          },
          {
            type: 'details',
            items: [
              '📅 Date: Next Thursday, 2 PM EST',
              '⏰ Duration: 60 minutes + Q&A',
              '🎯 What You\'ll Learn: Key insights and strategies',
              '🎁 Bonus: Recording + slides for all attendees'
            ]
          },
          {
            type: 'form',
            fields: ['email', 'name', 'company'],
            submitText: 'Secure My Seat'
          }
        ]
        break
        
      case 'ebook':
        baseContent.blocks = [
          {
            type: 'hero',
            title: `Download: ${title}`,
            subtitle: 'Get your free copy of this comprehensive guide',
            buttonText: 'Download Now',
            imageUrl: null
          },
          {
            type: 'features',
            items: [
              '📖 50+ pages of actionable content',
              '📊 Real-world case studies',
              '🛠️ Practical templates and tools',
              '🚀 Growth strategies that work'
            ]
          },
          {
            type: 'form',
            fields: ['email', 'name'],
            submitText: 'Get My Free Copy'
          }
        ]
        break
        
      case 'consultation':
        baseContent.blocks = [
          {
            type: 'hero',
            title: `Book Your Free ${title}`,
            subtitle: 'Schedule a 30-minute strategy session with our experts',
            buttonText: 'Book Now',
            imageUrl: null
          },
          {
            type: 'benefits',
            items: [
              '🎯 Personalized strategy review',
              '📈 Growth opportunity analysis',
              '🛠️ Actionable recommendations',
              '💼 No obligation, pure value'
            ]
          },
          {
            type: 'form',
            fields: ['email', 'name', 'phone', 'company'],
            submitText: 'Schedule My Session'
          }
        ]
        break
    }
    
    return baseContent
  }
  
  // Generate complete magic page
  static generateMagicPage(email) {
    const title = this.generateTitleFromEmail(email)
    const slug = this.generateSlug(title)
    const template = this.determineTemplate(email)
    const goal = this.determineGoal(email)
    const content = this.generateContent(template, title)
    
    return {
      title,
      slug: `${slug}-${Date.now().toString().slice(-6)}`,
      template,
      goal,
      content,
      published: true, // Auto-publish for lazy users
      published_at: new Date().toISOString()
    }
  }
  
  // Generate share message
  static generateShareMessage(title, pageUrl) {
    const messages = [
      `Check out my new lead page: ${title} - ${pageUrl}`,
      `I just created a lead page for ${title}. Take a look: ${pageUrl}`,
      `New lead page live: ${title}. Perfect for capturing emails! ${pageUrl}`,
      `🚀 Just launched: ${title}. Start capturing leads today! ${pageUrl}`
    ]
    
    return messages[Math.floor(Math.random() * messages.length)]
  }
}

export default MagicPageGenerator