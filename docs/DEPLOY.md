# GameAtlas Deployment Guide

This guide covers deploying GameAtlas to production using Vercel and Supabase.

## Prerequisites

1. A Vercel account ([sign up](https://vercel.com/signup))
2. A Supabase project ([create one](https://supabase.com/dashboard))
3. Node.js 18+ installed locally
4. Git repository connected to your project

## Environment Setup

### Required Environment Variables

Create a `.env` file in your project root with these variables:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
SERVER_SUPABASE_SERVICE_KEY=your-service-role-key

# API Keys (Optional - app will use fallbacks)
IGDB_CLIENT_ID=your-twitch-client-id
IGDB_CLIENT_SECRET=your-twitch-client-secret
RAWG_API_KEY=your-rawg-api-key
YOUTUBE_API_KEY=your-youtube-api-key
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
REDDIT_USER_AGENT=GameAtlasApp

# Configuration
STEAM_COUNTRY=US
VITE_PLAN_DEFAULT=starter
VITE_TRIAL_ENABLED=true
VITE_TRIAL_DAYS=14
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Project Settings > API
3. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon/Public Key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Service Role Key → `SERVER_SUPABASE_SERVICE_KEY`
   - Project Ref → `VITE_SUPABASE_PROJECT_ID`

### Optional API Keys

#### IGDB (Preferred for game metadata)
1. Create a Twitch Developer account
2. Register your app at https://dev.twitch.tv/console/apps
3. Copy Client ID and Client Secret

#### RAWG (Free fallback)
1. Sign up at https://rawg.io/
2. Get API key from https://rawg.io/apidocs

#### YouTube Data API
1. Go to Google Cloud Console
2. Enable YouTube Data API v3
3. Create credentials

#### Reddit OAuth
1. Go to https://www.reddit.com/prefs/apps
2. Create an app
3. Copy client ID and secret

## Database Setup

### 1. Run Migrations

The database schema is already created via Supabase migrations. Verify tables exist:

```bash
# Check if tables exist in Supabase Dashboard
# Go to: Database > Tables

# Should see these tables:
# - organizations (with plan column)
# - projects
# - games
# - game_signals
# - matches
# - community_opportunities
# - creators
# - campaigns
# - campaign_posts
# - activity_log
# - marketing_metrics
# - usage_counters
```

### 2. Seed Test Data (Optional)

```bash
npm run seed
```

This creates sample organizations for each plan with test data.

### 3. Run Smoke Tests

```bash
npm run smoke
```

Verifies database tables, RLS policies, and functions are working.

## Deployment Steps

### Deploy to Vercel

#### Option 1: Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Add Environment Variables:
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env`
   - Make sure to add `VITE_*` variables as they're needed at build time

6. Click "Deploy"

#### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts to link project
# Add environment variables when prompted

# Deploy to production
vercel --prod
```

### Configure Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

## Post Deployment

### 1. Verify Deployment

Visit your deployed URL and test:
- [ ] Homepage loads
- [ ] User can sign up
- [ ] User can log in
- [ ] Dashboard shows correctly
- [ ] Can create a project
- [ ] Can navigate between pages

### 2. Set Up Monitoring

Consider adding:
- Vercel Analytics (built in)
- Error tracking (Sentry, LogRocket)
- Uptime monitoring (UptimeRobot, Pingdom)

### 3. Configure Authentication

In Supabase Dashboard:
1. Go to Authentication > URL Configuration
2. Add your production URL to "Site URL"
3. Add to "Redirect URLs":
   - `https://yourdomain.com/**`
   - `https://yourdomain.com/reset-password`

### 4. Review Security

- [ ] All RLS policies are enabled
- [ ] Service role key is only in server environment
- [ ] API keys are in environment variables, not committed to git
- [ ] CORS is properly configured

## Troubleshooting

### Build Fails

**Issue**: TypeScript errors
```bash
# Run locally first
npm run build

# Fix any type errors before deploying
```

**Issue**: Missing environment variables
- Verify all `VITE_*` variables are set in Vercel
- Remember `VITE_*` variables are needed at build time

### Database Connection Issues

**Issue**: "relation does not exist"
- Run migrations in Supabase
- Check table names match code

**Issue**: "row violates row level security"
- Verify RLS policies are created
- Check user is authenticated properly

### API Integration Issues

**Issue**: Features show empty states
- This is expected if API keys are not configured
- Add API keys to enable real data
- App gracefully falls back to empty states

### Missing Data Sources

If you see empty states for:
- Game metadata → Add IGDB or RAWG keys
- Creator matches → Add YouTube key
- Community opportunities → Add Reddit keys

The app will continue to work with graceful empty states.

## Updating the App

### Deploy Updates

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel auto deploys from main branch
# Or manually deploy:
vercel --prod
```

### Database Updates

For schema changes:
1. Create migration in Supabase Dashboard
2. Test in development
3. Apply to production via Dashboard

## Maintenance

### Regular Tasks

- Monitor error logs in Vercel
- Check database usage in Supabase
- Review API quota usage
- Update dependencies monthly

### Backup

Supabase provides automatic backups:
- Go to Database > Backups
- Download latest backup regularly

## Support

For issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Supabase Documentation](https://supabase.com/docs)
3. Review application logs in Vercel Dashboard
4. Check Supabase logs for database issues

## Cost Estimates

### Free Tier (Development)
- Vercel: Free for personal projects
- Supabase: Free up to 500MB database, 2GB bandwidth

### Production (Estimated Monthly)
- Vercel Pro: $20/month (optional, for better performance)
- Supabase Pro: $25/month (recommended for production)
- Total: ~$45/month for small scale

Scale costs increase with usage. Monitor dashboards regularly.
