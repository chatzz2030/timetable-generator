# 🕒 Smart Timetable Generator

A full-stack web application that generates optimized timetables for educational institutions with smart scheduling algorithms, mobile-responsive design, and PDF export capabilities.

## ✨ Features

### 🎯 Core Functionality
- **Smart Scheduling Algorithm**: Prevents teacher conflicts and optimizes class distribution
- **Lab Management**: 3-hour continuous lab blocks on specific days (Tue, Thu, Fri)
- **Special Periods**: Sports, Library, and Counseling in last periods only
- **Gap Prevention**: Intelligently adds breaks between teacher assignments
- **Multi-Section Support**: Different timetables for multiple sections
- **Teacher Schedule View**: Individual teacher timetables

### 🖥️ User Interface
- **Mobile-First Design**: Responsive on phones, tablets, and desktops
- **Modern UI**: Clean interface with Tailwind CSS
- **Real-time Validation**: Form validation with helpful error messages
- **Loading Animations**: Progress indicators during generation
- **Touch-Friendly**: Optimized for mobile interactions

### 📊 Export Options
- **PDF Downloads**: Section-wise and teacher-wise timetables
- **Clean Formatting**: Professional PDF layout with proper styling
- **Multiple Views**: Switch between section and teacher perspectives

## 🚀 Live Demo

The application is deployed and accessible at:
- **Frontend**: https://timetable-generator-frontend.vercel.app
- **Backend API**: https://timetable-generator-backend.onrender.com

## 🏗️ Tech Stack

### Backend
- **Flask** - Python web framework
- **ReportLab** - PDF generation
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - WSGI HTTP Server

### Frontend
- **React 18** - Modern JavaScript library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

## 📁 Project Structure

```
timetable-generator/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── Procfile              # Deployment configuration
│   └── runtime.txt           # Python version
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ConfigForm.js
│   │   │   ├── TimetableDisplay.js
│   │   │   └── LoadingSpinner.js
│   │   ├── App.js           # Main App component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Tailwind styles
│   ├── package.json         # Node dependencies
│   ├── tailwind.config.js   # Tailwind configuration
│   └── postcss.config.js    # PostCSS configuration
├── .replit                  # Replit configuration
├── replit.nix              # Replit environment
├── vercel.json             # Vercel deployment
└── README.md               # Documentation
```

## 🚀 Deployment Options

### Option 1: Replit (Easiest - All-in-One)

1. **Fork the Replit**:
   - Go to [Replit](https://replit.com)
   - Import this repository
   - Click "Run" - everything is pre-configured!

2. **Access Your App**:
   - Backend will run on the Replit URL
   - Deploy with Replit Deployments for a public URL

### Option 2: Vercel + Render (Recommended for Production)

#### Deploy Backend on Render:

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Deploy Backend**:
   ```bash
   # Connect your GitHub repository to Render
   # Set build command: pip install -r backend/requirements.txt
   # Set start command: gunicorn --bind 0.0.0.0:$PORT backend.app:app
   ```

3. **Note your backend URL**: `https://your-app-name.onrender.com`

#### Deploy Frontend on Vercel:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Update API URL**:
   ```bash
   # In frontend/.env.production
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

### Option 3: Local Development

1. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📖 How to Use

### 1. Basic Configuration
- **Working Days**: Choose 5 or 6 days
- **Periods per Day**: Set number of periods (6-8)
- **Period Duration**: Set minutes per period (40-60)
- **College Hours**: Set start and end times

### 2. Add Teachers
- Enter teacher names one by one
- Assign subjects each teacher can handle
- Support for multiple subjects per teacher

### 3. Configure Sections
- Add section names (e.g., CS-A, DS-B)
- Define subjects for each section
- Include lab subjects (must contain "lab" in name)

### 4. Generate & Download
- Click "Generate Timetable"
- View section-wise or teacher-wise schedules
- Download PDFs for any section or teacher

## 🎯 Scheduling Rules

The application follows these intelligent rules:

1. **No Conflicts**: Teachers can't be in two places simultaneously
2. **Lab Scheduling**: 
   - Labs are 3-hour continuous blocks
   - Only on Tuesday, Thursday, Friday
   - Prevent interruptions
3. **Special Periods**: Sports/Library/Counseling only in last period
4. **Gap Management**: Prevents back-to-back teaching when possible
5. **Subject Distribution**: Avoids repeating subjects in same day
6. **Balanced Workload**: Distributes teaching load evenly

## 🔧 API Endpoints

### Backend API

- `GET /api/health` - Health check
- `POST /api/generate-timetable` - Generate new timetable
- `POST /api/download-pdf` - Download PDF

### Request Format

```json
{
  "working_days": 6,
  "periods_per_day": 7,
  "period_duration": 50,
  "start_time": "08:00",
  "end_time": "15:00",
  "teachers": ["Dr. Smith", "Prof. Johnson"],
  "sections": [
    {
      "name": "CS-A",
      "subjects": ["Mathematics", "Physics", "Computer Lab"]
    }
  ],
  "teacher_subjects": {
    "Dr. Smith": ["Mathematics", "Physics"],
    "Prof. Johnson": ["Computer Lab"]
  }
}
```

## 🎨 Customization

### Styling
- Modify `frontend/src/index.css` for custom styles
- Update `frontend/tailwind.config.js` for theme changes
- Colors, fonts, and spacing can be customized

### Algorithm
- Edit `backend/app.py` `TimetableGenerator` class
- Modify scheduling rules in `assign_labs()` and `assign_special_periods()`
- Adjust conflict resolution logic

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend has `Flask-CORS` enabled
   - Check API URL in frontend environment variables

2. **PDF Generation Fails**:
   - Verify ReportLab installation
   - Check if all required data is present

3. **Mobile Display Issues**:
   - Tables are horizontally scrollable on small screens
   - Use landscape mode for better viewing

4. **Deployment Issues**:
   - Ensure all environment variables are set
   - Check build logs for missing dependencies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for educational institutions
- Icons by [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- PDF generation powered by [ReportLab](https://www.reportlab.com/)

---

**Made with 💻 and ☕** 

Ready to use • No installation required • Works everywhere