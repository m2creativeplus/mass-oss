# MASS Car Workshop VWMS - Deployment Guide

## 🚀 Quick Deployment Options

### Option A: Railway.app (Recommended - Fastest)

**Time to Deploy: ~15 minutes**

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Deploy from GitHub
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `MASS-Car-Workshop-VWMS` repository
4. Railway will auto-detect Next.js

#### Step 3: Add Environment Variables
In Railway dashboard → Variables:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

#### Step 4: Deploy
Click **"Deploy"** - Railway handles the rest!

---

### Option B: Render.com

**Time to Deploy: ~20 minutes**

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure settings:
   - **Name**: `mass-car-workshop`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

#### Step 3: Environment Variables
Add in Render dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

#### Step 4: Deploy
Click **"Create Web Service"**

---

### Option C: Google Cloud Run (Uses Google One)

**Time to Deploy: ~45 minutes**

#### Prerequisites
- Google Cloud account (uses your Google One billing)
- Google Cloud CLI installed

#### Step 1: Enable APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

#### Step 2: Deploy
```bash
cd MASS-Car-Workshop-VWMS

gcloud run deploy mass-workshop \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=<your-url>,NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>"
```

---

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables set up (run SQL scripts)
- [ ] Environment variables ready:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] GitHub repository connected
- [ ] Build tested locally (`npm run build`)

---

## 🔧 Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ After Deployment

1. **Test the login page**
2. **Create an admin user:**
   - Register via the app
   - Go to Supabase → Table Editor → user_profiles
   - Change role to `admin`
3. **Test all modules**
4. **Set up custom domain (optional)**

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Node.js version (18+) |
| Env vars not working | Ensure `NEXT_PUBLIC_` prefix |
| Database connection fails | Verify Supabase URL and key |
| 500 errors | Check Supabase RLS policies |

---

*Last Updated: December 29, 2025*
