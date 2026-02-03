# Test LeadGen Lite - DEMO VERSION

## Live URL
https://sgixus1.github.io/leadgen-lite/

## What to Test

### 1. Sign Up (Immediate)
- Click "START YOUR FREE TRIAL"
- Scroll to signup form
- Enter any email (e.g., `test@example.com`)
- Enter any password (6+ characters)
- Click "Create Account"
- ✅ Should immediately redirect to dashboard

### 2. Dashboard Features
- **Stats cards** should show numbers
- **Create New Lead Page** button works
- **Recent Pages** table (empty at first)
- **Plan indicator** shows "Free Plan"
- **Sign Out** button works

### 3. Create Lead Page
- Click "Create New Lead Page"
- Page should appear in table
- Click "Edit" or "View" buttons
- ✅ Demo data persists across page refresh

### 4. Test Limits
- Free plan allows 1 page
- Try creating second page → should show limit
- Upgrade buttons work (demo)

### 5. Cross-tab Testing
- Open app in another tab
- Should still be logged in
- Sign out in one tab → other tab should update

## How It Works (Demo Mode)

### Storage
- Uses `localStorage` (browser storage)
- No server required
- Data persists until browser cleared

### Authentication
- Demo users stored in localStorage
- No password hashing (for demo only!)
- Sessions expire after 24 hours

### Data Structure
```
localStorage:
- leadgen_lite_demo_users: {email: {user data}}
- leadgen_lite_current_user: {session data}
- leadgen_lite_pages: [page1, page2...]
- leadgen_lite_leads: [lead1, lead2...]
```

## Next Steps for Production

### 1. Configure Supabase
```
1. Go to: https://app.supabase.com/project/dylxoqnauorghuqehjnb
2. Authentication → URL Configuration
3. Add Site URL: https://sgixus1.github.io
4. Add Redirect URLs:
   - https://sgixus1.github.io/leadgen-lite/
   - https://sgixus1.github.io/leadgen-lite/dashboard
5. Save
```

### 2. Create Database Tables
Run SQL from `SETUP_SUPABASE.md` in Supabase SQL Editor

### 3. Deploy to Vercel (Recommended)
- Better CORS handling
- Custom domain support
- Serverless functions for webhooks

### 4. Add Stripe
- Create Stripe account
- Add publishable key
- Set up webhooks

## Troubleshooting

### If Sign Up Fails:
- Check browser console (F12 → Console)
- Clear localStorage and retry
- Try different email format

### If Dashboard Doesn't Load:
- Refresh page
- Check if JavaScript is enabled
- Try incognito mode

### Demo Limitations:
- Data only in current browser
- No email verification
- No password recovery
- No real payments

## Production Ready Checklist
- [ ] Supabase CORS configured
- [ ] Database tables created
- [ ] Email templates set up
- [ ] Stripe integration added
- [ ] Custom domain configured
- [ ] Analytics tracking
- [ ] Terms/Privacy pages
- [ ] Email support set up

## Quick Launch Path
1. **Today:** Test demo, get feedback
2. **Tomorrow:** Configure Supabase, deploy to Vercel
3. **Day 3:** Add Stripe, set up email
4. **Day 4:** Custom domain, start marketing
5. **Day 5:** First paying customers!

## Support
- **GitHub Issues:** https://github.com/sgixus1/leadgen-lite/issues
- **Live Chat:** (Coming soon)
- **Email:** support@leadgenlite.com (demo)

---

**The app is ready for testing!** 🚀