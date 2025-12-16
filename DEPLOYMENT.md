# DEPLOYMENT GUIDE - Counterfactual Financial Oracle

## Quick Deploy to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended for easy repo connection)

### Step 2: Deploy Backend
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select **plminq/Banking**
3. Click **"Add variables"** and add:
   ```
   GEMINI_API_KEY=your_key
   DEEPSEEK_API_KEY=your_key
   LANDINGAI_API_KEY=your_key
   DATABASE_URL=(Railway auto-fills when you add PostgreSQL)
   ```
4. Set **Root Directory**: `counterfactual_oracle/backend`
5. Click **Deploy**

### Step 3: Add PostgreSQL Database
1. In your project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway auto-connects it to your backend

### Step 4: Deploy Frontend
1. Click **"New"** → **"GitHub Repo"** → select **plminq/Banking** again
2. Set **Root Directory**: `counterfactual_oracle/frontend`
3. Add variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Get this URL from your backend service after deployment)
4. Click **Deploy**

### Step 5: Access Your App
- Backend: `https://<project>-backend.railway.app`
- Frontend: `https://<project>-frontend.railway.app`

## Environment Variables Reference

| Variable | Service | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | Backend | For AI optimist agent |
| `DEEPSEEK_API_KEY` | Backend | For AI critic agent |
| `LANDINGAI_API_KEY` | Backend | For PDF extraction |
| `DATABASE_URL` | Backend | Auto-set by Railway PostgreSQL |
| `CORS_ORIGINS` | Backend | Frontend URL (auto-configured) |
| `VITE_API_URL` | Frontend | Backend API URL |

## Verify Deployment

```bash
# Test backend
curl https://your-backend.railway.app/health
# Expected: {"status": "healthy"}
```

## Troubleshooting

- **Build fails**: Check logs in Railway dashboard
- **CORS errors**: Ensure `CORS_ORIGINS` includes frontend URL
- **API errors**: Verify all API keys are set correctly
