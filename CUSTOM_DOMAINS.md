# Custom Domain Implementation Plan

## 🎯 Feature: Custom Domains for Agency Tier

### Business Value
- **Premium feature** for Agency tier ($49.99/month)
- **White-label solution** for agencies serving clients
- **Professional appearance** - clients see their own domain
- **Competitive advantage** - few competitors offer this at affordable price

### Implementation Phases

#### Phase 1: Basic Custom Domains (MVP)
**Features:**
- User adds domain in dashboard
- We provide DNS instructions (CNAME record)
- Manual verification (user clicks verification link)
- Domain maps to `username.leadgenlite.com` subdomain

**Tech:**
- Database table: `custom_domains`
- Verification system
- Basic DNS check

#### Phase 2: Automated SSL & Proxy
**Features:**
- Automatic SSL certificates (Let's Encrypt)
- Proxy through Vercel/Netlify edge functions
- Auto-renewal of certificates
- Health monitoring

**Tech:**
- Vercel/Netlify API for domain management
- ACME client for SSL
- Cron jobs for renewal

#### Phase 3: Advanced Features
**Features:**
- Multiple domains per account
- Domain analytics
- Email forwarding
- Subdomain support
- Bulk domain management

### Database Schema
```sql
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, failed, suspended
  verification_token VARCHAR(100),
  verified_at TIMESTAMP,
  ssl_certificate JSONB,
  last_renewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_custom_domains_user_id ON custom_domains(user_id);
CREATE INDEX idx_custom_domains_status ON custom_domains(status);
```

### User Flow
1. **User purchases Agency tier**
2. **Navigates to Domains section** in dashboard
3. **Enters domain** (e.g., `leads.theiragency.com`)
4. **Receives DNS instructions:**
   ```
   Type: CNAME
   Name: leads
   Value: proxy.leadgenlite.com
   TTL: 3600
   ```
5. **Clicks "Verify Domain"** after DNS propagation
6. **System checks DNS** and activates domain
7. **Automatic SSL certificate** issued within 5 minutes
8. **Domain active** - all lead pages accessible via custom domain

### Technical Implementation

#### Backend (Supabase Edge Functions)
```javascript
// verify-domain.js
export default async (req, res) => {
  const { domain, verificationToken } = req.body;
  
  // Check DNS records
  const dnsValid = await verifyDNS(domain);
  
  if (dnsValid) {
    // Update domain status
    await supabase.from('custom_domains').update({
      status: 'active',
      verified_at: new Date()
    }).eq('verification_token', verificationToken);
    
    // Request SSL certificate
    await requestSSLCertificate(domain);
    
    return res.status(200).json({ success: true });
  }
  
  return res.status(400).json({ error: 'DNS not configured correctly' });
};
```

#### Frontend Component
```jsx
function CustomDomainManager() {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  
  const addDomain = async () => {
    const { data, error } = await supabase.functions.invoke('verify-domain', {
      body: { domain: newDomain }
    });
    
    if (data.success) {
      setDomains([...domains, { domain: newDomain, status: 'pending' }]);
    }
  };
  
  return (
    <div>
      <h3>Custom Domains</h3>
      <input 
        placeholder="leads.yourdomain.com"
        value={newDomain}
        onChange={(e) => setNewDomain(e.target.value)}
      />
      <button onClick={addDomain}>Add Domain</button>
      
      {domains.map(domain => (
        <DomainCard key={domain.id} domain={domain} />
      ))}
    </div>
  );
}
```

### DNS Configuration Guide
We'll provide users with clear instructions:

```
## How to Configure Your Custom Domain

1. **Log into your domain registrar** (GoDaddy, Namecheap, etc.)
2. **Go to DNS Management**
3. **Add a new CNAME record:**
   - Type: CNAME
   - Host/Name: leads (or subdomain of your choice)
   - Value/Points to: proxy.leadgenlite.com
   - TTL: 3600 (or default)

4. **Wait 5-60 minutes** for DNS propagation
5. **Click "Verify"** in your LeadGen Lite dashboard

## Need Help?
- Email: support@leadgenlite.com
- Live Chat: Available in dashboard
- Documentation: https://docs.leadgenlite.com/domains
```

### Security Considerations
1. **Domain validation** - Prevent domain hijacking
2. **Rate limiting** - Prevent abuse
3. **SSL certificate security** - Proper key management
4. **DNS verification** - Ensure user owns domain
5. **Monitoring** - Alert on certificate expiration

### Pricing Strategy
- **Included in Agency tier** ($49.99/month)
- **Additional domains:** $9.99/month per extra domain
- **Bulk discounts** for agencies with multiple clients

### Competitor Analysis
- **Leadpages:** $99/month for custom domains
- **Unbounce:** $99/month for custom domains
- **Instapage:** $199/month for custom domains
- **Our advantage:** $49.99/month INCLUDES custom domains

### Timeline
- **Week 1:** Database schema + basic UI
- **Week 2:** DNS verification system
- **Week 3:** SSL certificate automation
- **Week 4:** Testing & documentation
- **Week 5:** Launch to Agency tier customers

### Success Metrics
- **Adoption rate:** % of Agency users enabling custom domains
- **Setup success rate:** % of domains successfully configured
- **Customer satisfaction:** NPS score for domain feature
- **Retention impact:** Effect on Agency tier churn rate

---

**This feature will be a key differentiator** and justify the Agency tier price point while providing real value to marketing agencies.