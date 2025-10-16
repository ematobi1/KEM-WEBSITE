# Production Deployment Guide - KEM Logistics

## 🎯 Overview

This guide covers deploying your KEM Logistics website and backend to production.

**What you'll deploy:**
- Frontend (HTML/CSS/JS) → Netlify, Vercel, or GitHub Pages
- Backend (Node.js API) → Heroku, Railway, or Render
- Database (MongoDB) → MongoDB Atlas (Cloud)

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All features tested locally
- [ ] Backend connects to MongoDB successfully
- [ ] Email service working
- [ ] Admin account created
- [ ] Environment variables documented
- [ ] Security settings reviewed

---

## 🗄️ Step 1: Deploy Database (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create organization (e.g., "KEM Logistics")

### 1.2 Create Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select cloud provider: **AWS**
4. Region: Choose closest to your users (e.g., US East)
5. Cluster name: `kem-logistics-cluster`
6. Click "Create"

### 1.3 Configure Database Access

1. Go to "Database Access" → "Add New Database User"
2. Authentication Method: Password
3. Username: `kemlogistics`
4. Password: Generate secure password (save it!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

### 1.4 Configure Network Access

1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### 1.5 Get Connection String

1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 4.1 or later
4. Copy connection string:
   ```
   mongodb+srv://kemlogistics:<password>@kem-logistics-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Save this - you'll need it for backend deployment

---

## 🚀 Step 2: Deploy Backend API

We'll use **Railway** (easiest and free tier available).

### Option A: Railway (Recommended)

#### 2.1 Prepare Backend for Deployment

1. Create `.gitignore` in `server` folder (already exists)
2. Make sure `.env` is in `.gitignore`
3. Update `server/package.json` - add this under `"scripts"`:
   ```json
   "start": "node server.js"
   ```

#### 2.2 Deploy to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your GitHub account
5. Create a new repository for your project:
   - Go to GitHub → Create new repository: `kem-logistics`
   - Push your code to GitHub

6. In Railway, select your repository
7. Click "Add variables" and add these environment variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://kemlogistics:yourpassword@cluster.mongodb.net/kem-logistics
JWT_SECRET=your-super-long-random-secret-key-at-least-64-characters-long
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=kemlogistics23@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=KEM Logistics <kemlogistics23@gmail.com>
FRONTEND_URL=https://your-frontend-url.netlify.app
ADMIN_EMAIL=admin@kemlogistics.com
ADMIN_PASSWORD=your-secure-admin-password
```

8. Railway will auto-deploy
9. Once deployed, you'll get a URL like: `https://kem-logistics.up.railway.app`
10. Save this URL - this is your backend API URL

### Option B: Heroku (Alternative)

1. Go to https://heroku.com
2. Create free account
3. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
4. Login: `heroku login`
5. Create app: `heroku create kem-logistics-api`
6. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-connection-string
   heroku config:set JWT_SECRET=your-secret
   # ... set all other variables
   ```
7. Deploy:
   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a kem-logistics-api
   git push heroku main
   ```

### Option C: Render (Alternative)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect repository
5. Configure:
   - Name: `kem-logistics-api`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables (same as Railway)
7. Click "Create Web Service"

---

## 🌐 Step 3: Deploy Frontend

### Option A: Netlify (Recommended)

#### 3.1 Prepare Frontend

1. Update `js/api.js` - change API_BASE_URL:
   ```javascript
   const API_BASE_URL = 'https://kem-logistics.up.railway.app/api';
   ```

#### 3.2 Deploy to Netlify

1. Go to https://www.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub
5. Select your repository
6. Configure:
   - Build command: (leave empty - static site)
   - Publish directory: `.` (root directory)
7. Click "Deploy site"
8. Netlify will give you a URL like: `https://kem-logistics-abc123.netlify.app`

#### 3.3 Custom Domain (Optional)

1. In Netlify, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `kemlogistics.com`)
4. Follow instructions to update DNS settings
5. Netlify provides free SSL certificate

### Option B: Vercel (Alternative)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - Framework Preset: Other
   - Root Directory: ./
6. Click "Deploy"

### Option C: GitHub Pages (Alternative)

1. Create repository on GitHub
2. Push your code
3. Go to Settings → Pages
4. Source: Deploy from branch
5. Branch: main, folder: / (root)
6. Save
7. Your site will be at: `https://yourusername.github.io/kem-logistics`

---

## 🔧 Step 4: Update CORS Settings

After deploying frontend, update backend CORS:

1. Update `FRONTEND_URL` environment variable in Railway/Heroku/Render:
   ```
   FRONTEND_URL=https://kem-logistics-abc123.netlify.app
   ```

2. If you need multiple origins, update `server/server.js`:
   ```javascript
   app.use(cors({
       origin: [
           process.env.FRONTEND_URL,
           'https://kemlogistics.com',
           'https://www.kemlogistics.com'
       ],
       credentials: true
   }));
   ```

---

## 🔐 Step 5: Security Hardening

### 5.1 Update JWT Secret

Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update in Railway/Heroku environment variables.

### 5.2 Change Admin Password

1. Login to your deployed admin panel
2. Change password from default `admin123`
3. Update `ADMIN_PASSWORD` in backend environment variables

### 5.3 Enable HTTPS Only

1. Frontend (Netlify/Vercel): Automatic
2. Backend (Railway/Heroku): Automatic
3. Update API calls to use `https://` instead of `http://`

### 5.4 Review Rate Limiting

Current settings (in `server/server.js`):
- 100 requests per 15 minutes per IP

Adjust if needed for production traffic.

---

## 📧 Step 6: Configure Email Service

### For Gmail (Current Setup):

1. Make sure 2FA is enabled on Gmail
2. Create App Password (see BACKEND-SETUP.md)
3. Add to backend environment variables

### For SendGrid (Recommended for Production):

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create API key
3. Update `server/utils/sendEmail.js`:
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   const sendEmail = async (options) => {
       const msg = {
           to: options.to,
           from: process.env.EMAIL_FROM,
           subject: options.subject,
           html: options.html,
       };
       await sgMail.send(msg);
   };
   ```
4. Install: `npm install @sendgrid/mail`
5. Add `SENDGRID_API_KEY` to environment variables

---

## ✅ Step 7: Post-Deployment Testing

### 7.1 Test Backend API

Visit: `https://your-backend-url.railway.app/api/health`

Should return:
```json
{
  "success": true,
  "message": "KEM Logistics API is running",
  "timestamp": "..."
}
```

### 7.2 Test Frontend

1. Visit your Netlify URL
2. Test quote form → Should save to database
3. Test contact form → Should send email
4. Test login → Should authenticate
5. Test tracking (need to create test shipment first)

### 7.3 Create Test Data

Login to admin panel and create:
- Test shipment with tracking number
- Test quote
- Test customer

---

## 📊 Step 8: Monitoring & Analytics

### 8.1 Backend Monitoring

**Railway/Heroku/Render:**
- Built-in logs and metrics
- Monitor API response times
- Track errors

### 8.2 Frontend Analytics

**Google Analytics:**
1. Create GA4 property
2. Add tracking code to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### 8.3 Error Tracking

**Sentry (Optional):**
1. Sign up at https://sentry.io
2. Create project
3. Add to backend and frontend
4. Track errors automatically

---

## 💰 Cost Breakdown (Monthly)

### Free Tier Setup:
- Frontend (Netlify): **$0**
- Backend (Railway): **$0** (500 hours free)
- Database (MongoDB Atlas): **$0** (512MB storage)
- Email (Gmail/SendGrid Free): **$0** (100 emails/day)

**Total: $0/month** for moderate traffic

### Paid Tier (High Traffic):
- Frontend (Netlify Pro): $19/month
- Backend (Railway Pro): $20/month
- Database (MongoDB Atlas M10): $57/month
- Email (SendGrid Essentials): $15/month

**Total: ~$111/month** for production traffic

---

## 🚨 Troubleshooting

### Deployment Fails

**Backend won't start:**
- Check environment variables are set
- Check MongoDB connection string
- Review deployment logs

**Frontend can't connect to backend:**
- Verify CORS settings
- Check API_BASE_URL in js/api.js
- Ensure backend is deployed and running

### Database Connection Errors

**MongoDB connection timeout:**
- Check network access (allow 0.0.0.0/0)
- Verify connection string
- Check database user permissions

### Email Not Sending

**Gmail authentication error:**
- Regenerate app password
- Check EMAIL_USER and EMAIL_PASSWORD
- Consider switching to SendGrid

---

## 📚 Additional Resources

- **Netlify Docs:** https://docs.netlify.com/
- **Railway Docs:** https://docs.railway.app/
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Heroku:** https://devcenter.heroku.com/
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices

---

## 🎉 Deployment Complete!

Your KEM Logistics website is now live!

**Your Production URLs:**
- Frontend: `https://kem-logistics.netlify.app`
- Backend API: `https://kem-logistics.railway.app/api`
- Database: MongoDB Atlas cluster

**What's Live:**
- ✅ Full responsive website
- ✅ Real-time tracking system
- ✅ Quote generation
- ✅ Contact form with email
- ✅ Admin dashboard
- ✅ User authentication
- ✅ Secure API

---

**Last Updated:** January 2025
