---
description: Safe deployment workflow for MASS OSS — prevents Convex instance mismatches and production crashes
---

# MASS OSS Safe Deploy Workflow

> **CRITICAL**: Always use `convex deploy` for production, NEVER `convex dev --once`.
> `convex dev` pushes to the DEV instance. `convex deploy` pushes to PRODUCTION.

## Pre-Flight Checks

// turbo
1. Verify you're in the correct directory:
```bash
cd "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/mass-workshop"
```

// turbo
2. Check which Convex instances exist:
```bash
grep "CONVEX_DEPLOYMENT" .env.local
# Expected: dev:festive-bullfrog-20 (DEV)
# Production is: artful-jaguar-416 (managed by `convex deploy`)
```

// turbo
3. Verify Vercel env vars match:
```bash
vercel env ls | grep CONVEX
# Must show NEXT_PUBLIC_CONVEX_URL in Production
```

## Deploy Sequence (ALWAYS use this order)

// turbo
4. Push Convex functions + schema to PRODUCTION and build Next.js:
```bash
npx convex deploy --cmd 'npm run build' --yes 2>&1 | tail -20
```
> This command does THREE things in the correct order:
> 1. Pushes schema/functions to the PRODUCTION Convex instance
> 2. Sets NEXT_PUBLIC_CONVEX_URL for the build
> 3. Runs `npm run build` with the correct env

// turbo
5. Deploy to Vercel:
```bash
vercel --prod --yes 2>&1 | tail -10
```

## Post-Deploy Verification

// turbo
6. Test the API endpoint:
```bash
curl -s https://mass-workshop-v2.vercel.app/api/test-api-key -X POST -H "Content-Type: application/json" -d '{"provider":"openai","apiKey":"sk-test"}' | python3 -m json.tool
```

7. Open and verify: https://mass-workshop-v2.vercel.app/dashboard

## ❌ BANNED Commands (These WILL break production)

- `npx convex dev --once` → Pushes to DEV instance, NOT production
- `npm run build` alone → Won't have correct CONVEX_URL
- `vercel --prod` without `convex deploy` first → Stale Convex types

## Instance Map
| Instance | URL | Purpose |
|----------|-----|---------|
| DEV | `festive-bullfrog-20.convex.cloud` | Local development only |
| PROD | `artful-jaguar-416.convex.cloud` | Vercel production |
