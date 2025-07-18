# Timetable Generator - Deployment Guide

## 1. Deploy the Backend (Flask) on Render

1. Go to https://render.com and sign up (free).
2. Click **New Web Service**.
3. Connect your GitHub and select the `/backend` folder of this repo.
4. Set the build and start commands:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
5. Set the environment:
   - **Python Version:** 3.9+
   - **Port:** 10000 (or leave blank if Render auto-detects)
6. Deploy. After a minute, you’ll get a public URL like `https://timetable-backend.onrender.com`.

## 2. Deploy the Frontend (React) on Vercel

1. Go to https://vercel.com and sign up (free).
2. Click **New Project** and import the `/frontend` folder from your GitHub.
3. In Vercel project settings, add an environment variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** (your Render backend URL, e.g. `https://timetable-backend.onrender.com`)
4. Deploy. You’ll get a public link like `https://timetable-frontend.vercel.app`.

## 3. Use Your App

- Open your Vercel frontend link on any device. Fill in the form and generate timetables!
- Download as PDF or image.

## 4. Notes
- No installation or setup required for users.
- All dependencies are pre-installed via requirements.txt and package.json.
- If you update the backend, redeploy on Render. If you update the frontend, redeploy on Vercel.

---

**Enjoy your public, live Timetable Generator!**