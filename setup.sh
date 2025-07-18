#!/bin/bash

# 🕒 Timetable Generator - Quick Setup Script
# This script sets up the development environment

echo "🕒 Setting up Timetable Generator..."
echo "====================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

echo "✅ Python 3 and Node.js found"

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend

# Install Python dependencies
echo "Installing Python packages..."
python3 -m pip install --user -r requirements.txt

echo "✅ Backend setup complete"

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd ../frontend

# Install Node.js dependencies
echo "Installing Node.js packages..."
npm install

echo "✅ Frontend setup complete"

# Back to root
cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "🚀 To run the application:"
echo "   Option 1: Run backend only:"
echo "     cd backend && python3 app.py"
echo ""
echo "   Option 2: Run frontend only (after building):"
echo "     cd frontend && npm start"
echo ""
echo "   Option 3: Run everything (Replit style):"
echo "     python3 main.py"
echo ""
echo "   Option 4: Test the API:"
echo "     python3 test_api.py"
echo ""
echo "📚 Read README.md for deployment instructions"
echo "🔗 Access at: http://localhost:3000 (frontend) or http://localhost:5000 (backend)"