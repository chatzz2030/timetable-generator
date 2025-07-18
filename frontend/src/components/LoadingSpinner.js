import React, { useState, useEffect } from 'react';
import { Loader, Clock, Users, Calendar } from 'lucide-react';

const LoadingSpinner = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const loadingMessages = [
    "Analyzing schedule constraints...",
    "Assigning teachers to sections...",
    "Optimizing lab sessions...",
    "Balancing workloads...",
    "Checking for conflicts...",
    "Finalizing timetable..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="card max-w-md w-full text-center">
        {/* Animated loader */}
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        {/* Loading title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Generating Your Timetable
        </h2>

        {/* Animated message */}
        <p className="text-gray-600 mb-6 h-6 transition-opacity duration-500">
          {loadingMessages[messageIndex]}
        </p>

        {/* Progress indicators */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Scheduling</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>Optimizing</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Loader className="h-4 w-4 animate-pulse" />
            <span>Processing</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((messageIndex + 1) / loadingMessages.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          This usually takes 10-30 seconds depending on complexity
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;