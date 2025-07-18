# 🚀 Deployment Guide

This guide provides step-by-step instructions to deploy the Timetable Generator application on various platforms. Choose the option that best fits your needs.

## 🎯 Quick Start - Replit (Recommended for Beginners)

### Why Replit?
- ✅ No setup required
- ✅ Backend + Frontend in one place
- ✅ Instant deployment
- ✅ Free tier available
- ✅ Auto-SSL and domain

### Steps:

1. **Create Replit Account**
   - Go to [replit.com](https://replit.com)
   - Sign up with GitHub or email

2. **Import Repository**
   ```
   1. Click "Create Repl"
   2. Choose "Import from GitHub"
   3. Paste this repository URL
   4. Name your repl: "timetable-generator"
   ```

3. **Configure & Run**
   ```bash
   # Everything is pre-configured!
   # Just click the "Run" button
   ```

4. **Deploy Publicly**
   ```
   1. In your repl, click "Deploy" button
   2. Choose "Replit Deployments"
   3. Deploy with a custom domain
   4. Share the public URL!
   ```

### 📱 Result:
Your app will be live at: `https://timetable-generator.yourname.repl.co`

---

## 🏗️ Production Setup - Vercel + Render

### Why This Setup?
- ✅ Professional deployment
- ✅ Better performance
- ✅ Custom domains
- ✅ Auto-scaling
- ✅ CI/CD pipeline

### Backend on Render

1. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   ```
   1. Click "New +" → "Web Service"
   2. Connect your GitHub repository
   3. Configure:
      - Name: timetable-backend
      - Environment: Python 3
      - Build Command: pip install -r backend/requirements.txt
      - Start Command: gunicorn --bind 0.0.0.0:$PORT backend.app:app
      - Auto-Deploy: Yes
   ```

3. **Environment Variables**
   ```
   Set in Render dashboard:
   - PYTHON_VERSION: 3.10.12
   - PORT: 10000 (auto-set)
   ```

4. **Note Backend URL**
   ```
   Your backend will be: https://timetable-backend.onrender.com
   ```

### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Prepare Frontend**
   ```bash
   cd frontend
   
   # Create production environment file
   echo "REACT_APP_API_URL=https://your-backend-url.onrender.com" > .env.production
   ```

3. **Deploy to Vercel**
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   
   # Follow prompts:
   # - Set up and deploy? Yes
   # - Which scope? Your account
   # - Link to existing project? No
   # - Project name: timetable-generator-frontend
   # - Directory: ./
   # - Override settings? No
   ```

4. **Configure Custom Domain (Optional)**
   ```bash
   # In Vercel dashboard:
   # 1. Go to your project
   # 2. Settings → Domains
   # 3. Add your custom domain
   ```

### 📱 Result:
- **Frontend**: `https://timetable-generator-frontend.vercel.app`
- **Backend**: `https://timetable-backend.onrender.com`

---

## 🐳 Docker Deployment

### Prerequisites
- Docker & Docker Compose installed
- Basic Docker knowledge

### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:5000
```

### Deploy
```bash
# Build and start
docker-compose up --build -d

# Access at http://localhost
```

---

## ☁️ Cloud Platform Specific

### AWS (EC2 + S3)

1. **Backend on EC2**
   ```bash
   # Launch Ubuntu EC2 instance
   # SSH into instance
   
   sudo apt update
   sudo apt install python3-pip nginx
   
   # Clone repo and setup
   git clone https://github.com/yourusername/timetable-generator.git
   cd timetable-generator/backend
   
   pip3 install -r requirements.txt
   pip3 install gunicorn
   
   # Run with gunicorn
   gunicorn --bind 0.0.0.0:5000 app:app
   ```

2. **Frontend on S3**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   
   # Upload to S3 bucket
   aws s3 sync build/ s3://your-bucket-name --delete
   
   # Enable static website hosting
   ```

### Google Cloud Platform

1. **Backend on Cloud Run**
   ```bash
   # Create Dockerfile in backend/
   # Build and deploy
   gcloud run deploy timetable-backend \
     --source=./backend \
     --region=us-central1 \
     --allow-unauthenticated
   ```

2. **Frontend on Firebase**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

### Microsoft Azure

1. **Backend on App Service**
   ```bash
   # Create App Service for Python
   # Deploy via Git or ZIP
   az webapp up --name timetable-backend \
     --resource-group myResourceGroup \
     --plan myAppServicePlan
   ```

2. **Frontend on Static Web Apps**
   ```bash
   # Connect GitHub repo to Azure Static Web Apps
   # Auto-deployment configured
   ```

---

## 🔧 Environment Variables

### Backend (.env)
```bash
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False

# CORS Settings
CORS_ORIGINS=https://yourdomain.com

# Optional: Database URL (if adding database)
# DATABASE_URL=postgresql://user:pass@host:port/db
```

### Frontend (.env.production)
```bash
# API Configuration
REACT_APP_API_URL=https://your-backend-url.com

# Optional: Analytics
# REACT_APP_GA_TRACKING_ID=GA_MEASUREMENT_ID
```

---

## 🚨 Common Issues & Solutions

### 1. CORS Errors
```python
# In backend/app.py
CORS(app, origins=["https://your-frontend-domain.com"])
```

### 2. Build Failures
```bash
# Frontend build issues
rm -rf node_modules package-lock.json
npm install
npm run build

# Backend dependency issues
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. PDF Generation Issues
```bash
# Ensure ReportLab is installed
pip install reportlab==4.0.4

# For Linux deployment, might need:
apt-get install python3-dev
```

### 4. Mobile Display Issues
```css
/* Add to index.css */
@media (max-width: 640px) {
  .timetable-container {
    overflow-x: auto;
  }
}
```

---

## 📊 Performance Optimization

### Frontend
```bash
# Enable production optimizations
npm run build

# Use CDN for static assets
# Implement lazy loading
# Minimize bundle size
```

### Backend
```python
# Use production WSGI server
gunicorn --workers 4 --bind 0.0.0.0:$PORT app:app

# Add caching
from flask_caching import Cache
cache = Cache(app)
```

---

## 🔒 Security Considerations

### Backend Security
```python
# Add security headers
from flask_talisman import Talisman
Talisman(app)

# Rate limiting
from flask_limiter import Limiter
limiter = Limiter(app)
```

### Frontend Security
```javascript
// Content Security Policy
// HTTPS only
// Input validation
```

---

## 📈 Monitoring & Analytics

### Error Tracking
```bash
# Sentry for error monitoring
pip install sentry-sdk[flask]
```

### Performance Monitoring
```bash
# Google Analytics
# Custom logging
# Uptime monitoring
```

---

## ✅ Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] PDF generation working
- [ ] Mobile responsiveness tested
- [ ] Error handling implemented
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring setup (optional)

---

## 🆘 Need Help?

1. **Check logs** for specific error messages
2. **Test locally** first before deploying
3. **Use browser dev tools** to debug frontend issues
4. **Check platform documentation** for platform-specific issues
5. **Create an issue** in the repository for bugs

---

**Happy Deploying! 🚀**