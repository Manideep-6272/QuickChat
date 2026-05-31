# Deployment Guide - QuickChat

Deploy to **Vercel (Frontend) + Railway (Backend)**

---

## 📋 Prerequisites
- ✅ MongoDB Atlas connection string (you have it)
- ✅ Cloudinary API credentials (you have them)
- GitHub account (for connecting repos)

---

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Prepare Backend for Deployment

First, update your backend code for production:

**File: `backend/src/index.js`**
- Ensure CORS is configured for Vercel frontend URL
- Environment variables are properly set

**File: `backend/package.json`**
- Ensure `"engines": { "node": "18" }` is set
- Check that start script exists: `"start": "node src/index.js"`

### 1.2 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)
3. Click **+ New Project** → **Deploy from GitHub repo**
4. Select your chat-app repository
5. Click "Deploy"

### 1.3 Configure Environment Variables on Railway

Once deployed, go to **Variables** tab and add:

```
MONGODB_URI=your_mongodb_atlas_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_secret_key_here
NODE_ENV=production
PORT=8000
```

⚠️ **IMPORTANT:** For MongoDB Atlas, add your Railway IP to the IP Whitelist:
- Go to MongoDB Atlas → Network Access
- Click "Add IP Address"
- Railway will show its public IP in the logs (or add `0.0.0.0/0`)

### 1.4 Get Your Backend URL

After deployment completes:
- Go to **Settings** tab
- Copy your **Railway URL** (looks like: `https://your-app.up.railway.app`)
- This is your `VITE_API_BASE_URL` for frontend

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Prepare Frontend for Deployment

**File: `frontend/.env.production`**

Create this file:
```
VITE_API_BASE_URL=https://your-railway-backend-url.up.railway.app
```

Or create `.env.local` with the same content for local testing.

### 2.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **Add New Project**
4. Select your `chat-app` repository
5. Select **frontend** as root directory

### 2.3 Configure Environment Variables on Vercel

In **Settings** → **Environment Variables**, add:
```
VITE_API_BASE_URL=https://your-railway-backend-url.up.railway.app
```

### 2.4 Deploy
Click **Deploy** and wait for completion!

Your frontend will be live at: `https://your-vercel-app.vercel.app`

---

## ⚙️ Step 3: Update Backend CORS Settings

**File: `backend/src/index.js`**

Update your CORS configuration:

```javascript
const cors = require('cors');

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://your-vercel-app.vercel.app']  // Your Vercel URL
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

io.use((socket, next) => {
  corsMiddleware(socket.request, socket.request.res = {}, next);
});
```

After updating, Railway will auto-redeploy! ✅

---

## 🧪 Step 4: Test Your Deployment

1. Go to your Vercel frontend URL
2. Try registering a new account
3. Test real-time messaging
4. Check browser console for any errors

---

## 🔧 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_BASE_URL` in Vercel environment variables
- Ensure backend CORS includes your Vercel URL
- Check browser Network tab for failed requests

### Socket.io connection fails
- Verify backend URL is correct
- Check Railway backend logs for errors
- Ensure MongoDB Atlas IP whitelist includes Railway IP

### Image uploads not working
- Verify Cloudinary credentials are set on Railway
- Test Cloudinary API directly

### MongoDB connection fails
- Verify `MONGODB_URI` is correct
- Add Railway IP to MongoDB Atlas whitelist
- Check MongoDB Atlas is not rate-limiting connections

---

## 📊 Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel (Frontend)                        │
│         https://your-vercel-app.vercel.app                 │
│              React + Socket.io Client                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ (HTTP + WebSocket)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Railway (Backend)                           │
│       https://your-railway-app.up.railway.app              │
│    Express + Socket.io + MongoDB Atlas Driver               │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   MongoDB Atlas   Cloudinary      JWT Auth
```

---

## 📝 Next Steps

1. ✅ Deploy backend to Railway (Step 1)
2. ✅ Get Railway backend URL
3. ✅ Deploy frontend to Vercel with env var (Step 2)
4. ✅ Update backend CORS settings
5. ✅ Test production deployment

---

## 💾 Quick Reference

| What | Where |
|------|-------|
| Backend URL | Railway dashboard → Settings |
| Frontend URL | Vercel dashboard → Deployments |
| Update code | Push to GitHub → Auto-deploys on both platforms |
| View logs | Railway dashboard → Logs or Vercel → Functions logs |
| Environment vars | Railway → Variables or Vercel → Settings → Environment Variables |

