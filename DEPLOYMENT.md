# AI Coding Agent - Deployment Guide

## Backend Deployment (Railway)

### 1. Deploy to Railway

1. **Go to Railway**: Visit [railway.app](https://railway.app)
2. **Sign up/Login**: Use GitHub to sign in
3. **Create New Project**: Click "New Project"
4. **Deploy from GitHub**: Select "Deploy from GitHub repo"
5. **Select Repository**: Choose your `jokerinfini/AI-coding-agent` repository
6. **Configure Service**: 
   - **Root Directory**: Set to `backend`
   - **Build Command**: Leave empty (Railway will auto-detect)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 2. Set Environment Variables in Railway

In your Railway dashboard, go to your service → Variables tab and add:

```
GEMINI_API_KEY=your_actual_gemini_api_key
E2B_API_KEY=your_actual_e2b_api_key
CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://*.vercel.app,https://*.railway.app
```

### 3. Get Your Railway Backend URL

After deployment, Railway will provide you with a URL like:
`https://your-project-name-production.up.railway.app`

## Frontend Deployment (Vercel)

### 1. Update Vercel Environment Variables

1. **Go to Vercel Dashboard**: Visit [vercel.com](https://vercel.com)
2. **Select Your Project**: Find your AI Coding Agent project
3. **Go to Settings**: Click on "Settings" tab
4. **Environment Variables**: Click "Environment Variables"
5. **Add Variable**: 
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-railway-backend-url.up.railway.app` (replace with your actual Railway URL)
   - **Environment**: Production

### 2. Redeploy Frontend

After setting the environment variable:
1. **Go to Deployments**: Click "Deployments" tab
2. **Redeploy**: Click "Redeploy" on the latest deployment
3. **Or Push to GitHub**: Push any changes to trigger automatic deployment

## Testing the Full Stack

### 1. Test Backend Health
Visit your Railway URL + `/health`:
```
https://your-railway-backend-url.up.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

### 2. Test Frontend Connection
1. Open your Vercel frontend URL
2. Open browser developer tools (F12)
3. Go to Network tab
4. Try sending a message in the chat
5. Check if requests are going to your Railway backend URL

### 3. Test API Keys
1. Open your frontend
2. Click the settings button (gear icon)
3. Enter your Gemini and E2B API keys
4. Save settings
5. Try asking the AI to generate some code
6. Check if the "View Generated Artifact" button appears

## Troubleshooting

### Backend Issues
- **Build Fails**: Check Railway logs for Python/dependency issues
- **CORS Errors**: Verify CORS_ORIGINS includes your Vercel domain
- **API Key Errors**: Check environment variables in Railway dashboard

### Frontend Issues
- **API Connection**: Verify VITE_API_BASE_URL in Vercel environment variables
- **CORS Errors**: Check browser console for CORS issues
- **Build Fails**: Check Vercel build logs for TypeScript/React issues

### Common Solutions
1. **Clear Browser Cache**: Hard refresh (Ctrl+F5) your frontend
2. **Check Network Tab**: Verify API calls are reaching the correct backend URL
3. **Verify API Keys**: Ensure both Gemini and E2B keys are valid and have proper permissions
4. **Check Logs**: Monitor both Railway and Vercel logs for error messages

## Environment Variables Summary

### Railway (Backend)
- `GEMINI_API_KEY`: Your Google Gemini API key
- `E2B_API_KEY`: Your e2b.dev API key  
- `CORS_ORIGINS`: Comma-separated list of allowed frontend domains

### Vercel (Frontend)
- `VITE_API_BASE_URL`: Your Railway backend URL

## URLs After Deployment

- **Frontend**: `https://your-project-name.vercel.app`
- **Backend**: `https://your-project-name-production.up.railway.app`
- **Backend Health**: `https://your-project-name-production.up.railway.app/health`
