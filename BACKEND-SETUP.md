# Backend Setup Guide - KEM Logistics

## 🎯 Overview

Your KEM Logistics website now has a complete backend API built with:
- **Node.js** + **Express.js** (Web server)
- **MongoDB** (Database)
- **JWT** (Authentication)
- **Nodemailer** (Email service)

---

## 📋 Prerequisites

Before starting, ensure you have installed:

1. **Node.js** (v14 or higher) - Already installed ✅
2. **MongoDB** - Need to install
3. **Email Configuration** - Gmail account with app password

---

## 🔧 Step 1: Install MongoDB

### Option 1: Install MongoDB Locally (Recommended for Development)

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a service
5. Verify installation:
   ```bash
   mongod --version
   ```

**Alternative - MongoDB Atlas (Cloud Database):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster (free tier available)
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/kem-logistics`)

---

## 🔧 Step 2: Configure Environment Variables

1. Navigate to the server directory:
   ```bash
   cd "C:\Users\emmat\KEM WEBSITE\server"
   ```

2. The `.env` file already exists. Open it and update:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - UPDATE THIS
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/kem-logistics

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kem-logistics

# JWT Secret (IMPORTANT: Change in production)
JWT_SECRET=kem-logistics-super-secret-jwt-key-2025-change-in-production
JWT_EXPIRE=7d

# Email Configuration - UPDATE THIS
EMAIL_SERVICE=gmail
EMAIL_USER=kemlogistics23@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here
EMAIL_FROM=KEM Logistics <kemlogistics23@gmail.com>

# Frontend URL (Update if different)
FRONTEND_URL=http://127.0.0.1:5500

# Admin Credentials
ADMIN_EMAIL=admin@kemlogistics.com
ADMIN_PASSWORD=admin123
```

---

## 🔧 Step 3: Get Gmail App Password

1. Go to Google Account: https://myaccount.google.com/
2. Click "Security"
3. Enable 2-Step Verification (if not enabled)
4. Search for "App passwords"
5. Generate new app password for "Mail"
6. Copy the 16-character password
7. Paste it in `.env` as `EMAIL_PASSWORD`

---

## 🚀 Step 4: Start the Backend Server

1. Make sure you're in the server directory:
   ```bash
   cd "C:\Users\emmat\KEM WEBSITE\server"
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. You should see:
   ```
   Server running in development mode on port 5000
   MongoDB Connected: localhost
   ```

4. Test the API health endpoint:
   Open browser: http://localhost:5000/api/health

   You should see:
   ```json
   {
     "success": true,
     "message": "KEM Logistics API is running",
     "timestamp": "2025-01-XX..."
   }
   ```

---

## 🔧 Step 5: Create Admin User (First Time Only)

You need to create an admin user in the database. You can do this via API:

### Using Command Line (PowerShell or CMD):

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Administrator\",\"email\":\"admin@kemlogistics.com\",\"password\":\"admin123\"}"
```

### Or using Postman/Thunder Client:

**POST** `http://localhost:5000/api/auth/register`

**Body (JSON):**
```json
{
  "name": "Administrator",
  "email": "admin@kemlogistics.com",
  "password": "admin123"
}
```

Then, manually update the user's role in MongoDB to `admin` (or use MongoDB Compass).

---

## 🌐 Step 6: Run the Frontend

1. Open a **NEW** terminal/command prompt (keep backend running)
2. Navigate to your website directory:
   ```bash
   cd "C:\Users\emmat\KEM WEBSITE"
   ```

3. Start the frontend with Live Server:
   - Open `index.html` in VS Code
   - Right-click → "Open with Live Server"
   - Website opens at http://127.0.0.1:5500

---

## ✅ Step 7: Test the Integration

### Test 1: Contact Form
1. Go to http://127.0.0.1:5500
2. Scroll to "Contact" section
3. Fill out the form and submit
4. Check your email for confirmation

### Test 2: Quote Request
1. Go to "Get a Quote" section
2. Fill out all fields
3. Click "Get My Quote"
4. You should see a quote number and estimated price

### Test 3: Login
1. Click "Sign In"
2. Use: `admin@kemlogistics.com` / `admin123`
3. You should be redirected to admin dashboard

---

## 🐛 Troubleshooting

### Backend won't start:

**Error: Cannot connect to MongoDB**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Try: `net start MongoDB` (Windows)

**Error: Port 5000 already in use**
- Change `PORT=5001` in `.env`
- Also update `API_BASE_URL` in `js/api.js` to `http://localhost:5001/api`

### Frontend can't connect to backend:

**CORS Error in browser console**
- Make sure backend is running
- Check `FRONTEND_URL` in server `.env` matches your frontend URL
- Restart backend after changing `.env`

**API requests fail**
- Open browser DevTools (F12) → Network tab
- Check if requests are going to http://localhost:5000/api
- Verify backend is running

### Email not sending:

**Error: Invalid login**
- Make sure you're using Gmail App Password (NOT your Gmail password)
- Re-generate app password if needed
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`

---

## 📊 API Endpoints Reference

### Public Endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/tracking/:trackingNumber` - Track shipment
- `POST /api/quotes` - Request quote
- `GET /api/quotes/:quoteNumber` - Get quote
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Require JWT Token):

- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `GET /api/tracking/my-shipments` - Get user's shipments

### Admin Endpoints (Require Admin Role):

- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/shipments` - All shipments
- `POST /api/admin/shipments` - Create shipment
- `PUT /api/admin/shipments/:id` - Update shipment
- `GET /api/admin/quotes` - All quotes
- `GET /api/admin/customers` - All customers

---

## 🔐 Security Notes

### For Development:
- Current setup is fine for local testing

### Before Production:
1. Change JWT_SECRET to a random 64+ character string
2. Use strong admin password (not `admin123`)
3. Enable HTTPS only
4. Add rate limiting (already configured)
5. Use environment variables for all secrets
6. Never commit `.env` file to Git
7. Enable MongoDB authentication
8. Use production MongoDB Atlas cluster

---

## 📦 Database Schema

Your database has 4 collections:

1. **users** - Customer and admin accounts
2. **shipments** - All shipments with tracking
3. **quotes** - Quote requests
4. **contacts** - Contact form submissions

---

## 🎉 Success!

Your backend is now running and integrated with your frontend!

**What works:**
- ✅ User login/registration with JWT
- ✅ Real-time shipment tracking
- ✅ Quote generation with email
- ✅ Contact form with email notifications
- ✅ Admin dashboard with stats
- ✅ Secure API with authentication

**Next Steps:**
1. Test all features thoroughly
2. Add real shipment data via admin panel
3. Customize email templates
4. Deploy to production (see DEPLOYMENT.md)

---

## 📞 Need Help?

Check these files:
- `DEPLOYMENT.md` - Production deployment guide
- `README.md` - Complete documentation
- `server/server.js` - Main server file
- `js/api.js` - API integration

**Last Updated:** January 2025
