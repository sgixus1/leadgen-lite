# Deployment Instructions

## Option 1: Deploy to Vercel (Recommended - Free)
1. **Go to:** https://vercel.com/new
2. **Import Git repository:** Connect your GitHub account
3. **Select this project:** `leadgen-lite`
4. **Deploy:** Click "Deploy" (takes 1 minute)
5. **Your live URL:** `https://leadgen-lite.vercel.app`

## Option 2: Deploy to Netlify (Free)
1. **Go to:** https://app.netlify.com/start
2. **Connect GitHub** and select this project
3. **Build settings:** 
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy:** Click "Deploy site"
5. **Your live URL:** `https://leadgen-lite.netlify.app`

## Option 3: Deploy to GitHub Pages
1. **Create GitHub repo:** `leadgen-lite`
2. **Push code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/leadgen-lite.git
   git push -u origin main
   ```
3. **Go to Settings → Pages**
4. **Source:** `GitHub Actions`
5. **Your live URL:** `https://YOUR_USERNAME.github.io/leadgen-lite`

## Quick Deploy Buttons
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sgixus1/leadgen-lite)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sgixus1/leadgen-lite)

## Environment Variables (After Deployment)
Once deployed, add these environment variables:

### For Supabase (Phase 2)
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### For Stripe (Phase 3)
```
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## Custom Domain Setup (After Deployment)
1. **Buy domain** (GoDaddy, Namecheap, etc.)
2. **In Vercel/Netlify dashboard:** Add custom domain
3. **Update DNS records** as instructed
4. **SSL certificate** auto-generated

## Next Steps After Deployment
1. **Set up Supabase project** (free: supabase.com)
2. **Create Stripe account** (stripe.com)
3. **Update environment variables** in deployment
4. **Start capturing leads!**

## Testing
- **Live URL:** Check all CTAs work
- **Mobile responsive:** Test on phone
- **Loading speed:** Should be < 3 seconds
- **SEO:** Meta tags included

## Support
- **Documentation:** https://docs.leadgenlite.com
- **Support:** support@leadgenlite.com
- **Community:** Discord/Telegram link

---

**Deploy now and start capturing leads today!** 🚀