import React, { useState } from 'react';
import { Calendar, Clock, Users, BookOpen, Download, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import ConfigForm from './components/ConfigForm';
import TimetableDisplay from './components/TimetableDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import axios from 'axios';

// Configure axios base URL - will be updated for deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [currentStep, setCurrentStep] = useState('config'); // 'config', 'loading', 'results'
  const [timetableData, setTimetableData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTimetable = async (config) => {
    setIsLoading(true);
    setError(null);
    setCurrentStep('loading');

    try {
      const response = await axios.post('/api/generate-timetable', config);
      
      if (response.data.success) {
        setTimetableData(response.data.data);
        setCurrentStep('results');
      } else {
        throw new Error(response.data.error || 'Failed to generate timetable');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate timetable');
      setCurrentStep('config');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToConfig = () => {
    setCurrentStep('config');
    setTimetableData(null);
    setError(null);
  };

  const downloadPDF = async (type, targetName) => {
    try {
      const response = await axios.post('/api/download-pdf', {
        timetable_data: timetableData,
        type: type,
        target_name: targetName
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${targetName}_timetable.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Timetable Generator</h1>
                <p className="text-sm text-gray-600">Create optimized schedules for your institution</p>
              </div>
            </div>
            
            {/* Features badges */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Smart Scheduling</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Multi-Section</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>Lab Management</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'config' ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'config' ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="font-medium">Configuration</span>
            </div>
            
            <div className="flex-1 h-px bg-gray-300"></div>
            
            <div className={`flex items-center space-x-2 ${currentStep === 'loading' ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'loading' ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {currentStep === 'loading' ? <Loader className="h-4 w-4 animate-spin" /> : '2'}
              </div>
              <span className="font-medium">Generation</span>
            </div>
            
            <div className="flex-1 h-px bg-gray-300"></div>
            
            <div className={`flex items-center space-x-2 ${currentStep === 'results' ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'results' ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                {currentStep === 'results' ? <CheckCircle className="h-4 w-4" /> : '3'}
              </div>
              <span className="font-medium">Results</span>
            </div>
          </div>
        </div>

        {/* Content based on current step */}
        {currentStep === 'config' && (
          <ConfigForm onGenerate={handleGenerateTimetable} />
        )}

        {currentStep === 'loading' && (
          <LoadingSpinner />
        )}

        {currentStep === 'results' && timetableData && (
          <TimetableDisplay 
            data={timetableData} 
            onBack={handleBackToConfig}
            onDownloadPDF={downloadPDF}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Built with ❤️ for educational institutions
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Responsive design • Works on all devices • No installation required
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;