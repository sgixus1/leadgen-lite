# Supabase Setup for LeadGen Lite

## Step 1: Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Create new organization (if needed)
5. Create project:
   - **Name:** `leadgen-lite`
   - **Database password:** Choose strong password
   - **Region:** `Southeast Asia (Singapore)` or closest to your users
   - Click "Create new project"

## Step 2: Get API Credentials
After project creation (takes 1-2 minutes):

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL:** `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Create Database Tables

Run this SQL in **SQL Editor**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  plan VARCHAR(20) NOT NULL DEFAULT 'free', -- free, starter, pro, agency
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, canceled, past_due
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Lead pages table
CREATE TABLE lead_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  template VARCHAR(50) DEFAULT 'basic',
  content JSONB DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES lead_pages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email sequences table
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(255) NOT NULL,
  steps JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom domains table (for agency tier)
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, failed, suspended
  verification_token VARCHAR(100),
  verified_at TIMESTAMP WITH TIME ZONE,
  ssl_certificate JSONB,
  last_renewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_lead_pages_user_id ON lead_pages(user_id);
CREATE INDEX idx_lead_pages_slug ON lead_pages(slug);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_page_id ON leads(page_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_email_sequences_user_id ON email_sequences(user_id);
CREATE INDEX idx_custom_domains_user_id ON custom_domains(user_id);
CREATE INDEX idx_custom_domains_status ON custom_domains(status);

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lead pages" ON lead_pages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own leads" ON leads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own email sequences" ON email_sequences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own custom domains" ON custom_domains
  FOR ALL USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_pages_updated_at
  BEFORE UPDATE ON lead_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_sequences_updated_at
  BEFORE UPDATE ON email_sequences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_domains_updated_at
  BEFORE UPDATE ON custom_domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Configure Authentication
1. Go to **Authentication → Settings**
2. Configure:
   - **Site URL:** `https://sgixus1.github.io/leadgen-lite/` (or your custom domain)
   - **Additional Redirect URLs:** Add your deployment URLs
3. Enable providers (optional):
   - **Email:** Enabled by default
   - **Google:** For social login (recommended)

## Step 5: Update Environment Variables

### For Local Development
Create `.env` file in project root:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Deployment
Add to your hosting platform:

**Vercel:**
- Project Settings → Environment Variables
- Add both variables

**Netlify:**
- Site Settings → Environment Variables
- Add both variables

**GitHub Pages:**
- Repository Settings → Secrets and variables → Actions
- Add both variables (for build process)

## Step 6: Test Configuration
1. Visit your live site
2. Click "Sign Up"
3. Create account
4. Should redirect to dashboard

## Step 7: Set Up Stripe (Next Phase)
1. Create Stripe account
2. Get publishable key
3. Add to environment: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
4. Set up webhooks

## Troubleshooting

### Common Issues:
1. **CORS errors:** Add your domain to Supabase Auth → URL Configuration
2. **RLS errors:** Check policies are created correctly
3. **Authentication redirect:** Ensure Site URL is correct
4. **Database connection:** Check if tables exist

### Verify Setup:
```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';
```

## Next Steps After Setup
1. **Test user registration**
2. **Create sample lead pages**
3. **Set up email templates**
4. **Configure Stripe payments**
5. **Add custom domain feature**

## Support
- **Supabase Docs:** https://supabase.com/docs
- **LeadGen Lite Docs:** (Coming soon)
- **GitHub Issues:** https://github.com/sgixus1/leadgen-lite/issues

---

**Your LeadGen Lite backend will be ready in 10 minutes!** 🚀