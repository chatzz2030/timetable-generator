#!/usr/bin/env python3
"""
Timetable Generator - Main Entry Point for Replit
Serves both backend API and frontend static files
"""

import os
import subprocess
import sys
from threading import Thread
import time

def install_dependencies():
    """Install Python and Node.js dependencies"""
    print("🔧 Installing dependencies...")
    
    # Install Python dependencies
    print("Installing Python packages...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"], check=True)
    
    # Install Node.js dependencies
    print("Installing Node.js packages...")
    os.chdir("frontend")
    subprocess.run(["npm", "install"], check=True)
    
    # Build React app
    print("Building React app...")
    subprocess.run(["npm", "run", "build"], check=True)
    
    os.chdir("..")
    print("✅ Dependencies installed successfully!")

def start_backend():
    """Start Flask backend server"""
    print("🚀 Starting backend server...")
    os.chdir("backend")
    
    # Import and run Flask app
    from app import app
    app.run(host='0.0.0.0', port=5000, debug=False)

def main():
    """Main function to run the application"""
    print("🕒 Smart Timetable Generator")
    print("==========================")
    
    try:
        # Install dependencies if not already installed
        if not os.path.exists("backend/__pycache__") or not os.path.exists("frontend/node_modules"):
            install_dependencies()
        
        # Start backend server
        print("🌟 Starting Timetable Generator...")
        print("📱 Access your app at: https://your-repl-url.replit.dev")
        print("🔧 Backend API running on port 5000")
        print("⚡ Ready to generate timetables!")
        print()
        
        start_backend()
        
    except KeyboardInterrupt:
        print("\n👋 Shutting down Timetable Generator...")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Try refreshing the page or restarting the repl")

if __name__ == "__main__":
    main()