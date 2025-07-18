import React, { useState } from 'react';
import { Plus, Minus, Users, Clock, MapPin, BookOpen } from 'lucide-react';

const ConfigForm = ({ onGenerate }) => {
  const [config, setConfig] = useState({
    working_days: 6,
    periods_per_day: 7,
    period_duration: 50,
    start_time: '08:00',
    end_time: '15:00',
    teachers: [],
    sections: [],
    teacher_subjects: {}
  });

  const [newTeacher, setNewTeacher] = useState('');
  const [newSection, setNewSection] = useState({ name: '', subjects: '' });

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTeacher = () => {
    if (newTeacher.trim()) {
      setConfig(prev => ({
        ...prev,
        teachers: [...prev.teachers, newTeacher.trim()]
      }));
      setNewTeacher('');
    }
  };

  const removeTeacher = (index) => {
    setConfig(prev => ({
      ...prev,
      teachers: prev.teachers.filter((_, i) => i !== index)
    }));
  };

  const addSection = () => {
    if (newSection.name.trim() && newSection.subjects.trim()) {
      const subjects = newSection.subjects.split(',').map(s => s.trim()).filter(s => s);
      setConfig(prev => ({
        ...prev,
        sections: [...prev.sections, { name: newSection.name.trim(), subjects }]
      }));
      setNewSection({ name: '', subjects: '' });
    }
  };

  const removeSection = (index) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const updateTeacherSubjects = (teacher, subjects) => {
    setConfig(prev => ({
      ...prev,
      teacher_subjects: {
        ...prev.teacher_subjects,
        [teacher]: subjects.split(',').map(s => s.trim()).filter(s => s)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (config.teachers.length === 0) {
      alert('Please add at least one teacher');
      return;
    }
    
    if (config.sections.length === 0) {
      alert('Please add at least one section');
      return;
    }

    // Check if all teachers have subjects assigned
    const teachersWithoutSubjects = config.teachers.filter(teacher => 
      !config.teacher_subjects[teacher] || config.teacher_subjects[teacher].length === 0
    );
    
    if (teachersWithoutSubjects.length > 0) {
      alert(`Please assign subjects to: ${teachersWithoutSubjects.join(', ')}`);
      return;
    }

    onGenerate(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Configuration */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary-600" />
          Basic Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Working Days
            </label>
            <select 
              value={config.working_days}
              onChange={(e) => handleInputChange('working_days', parseInt(e.target.value))}
              className="input-field"
            >
              <option value={5}>5 Days (Mon-Fri)</option>
              <option value={6}>6 Days (Mon-Sat)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periods per Day
            </label>
            <input
              type="number"
              min="6"
              max="8"
              value={config.periods_per_day}
              onChange={(e) => handleInputChange('periods_per_day', parseInt(e.target.value))}
              className="input-field"
              placeholder="e.g., 7"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period Duration (minutes)
            </label>
            <input
              type="number"
              min="40"
              max="60"
              value={config.period_duration}
              onChange={(e) => handleInputChange('period_duration', parseInt(e.target.value))}
              className="input-field"
              placeholder="e.g., 50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={config.start_time}
              onChange={(e) => handleInputChange('start_time', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={config.end_time}
              onChange={(e) => handleInputChange('end_time', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Teachers */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary-600" />
          Teachers
        </h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTeacher}
            onChange={(e) => setNewTeacher(e.target.value)}
            placeholder="Enter teacher name"
            className="input-field flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeacher())}
          />
          <button
            type="button"
            onClick={addTeacher}
            className="btn-primary flex items-center px-3"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {config.teachers.map((teacher, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="font-medium">{teacher}</span>
              <button
                type="button"
                onClick={() => removeTeacher(index)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        {config.teachers.length === 0 && (
          <p className="text-gray-500 text-center py-4">No teachers added yet</p>
        )}
      </div>

      {/* Sections */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary-600" />
          Sections & Subjects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <input
            type="text"
            value={newSection.name}
            onChange={(e) => setNewSection(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Section name (e.g., CS-A)"
            className="input-field"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newSection.subjects}
              onChange={(e) => setNewSection(prev => ({ ...prev, subjects: e.target.value }))}
              placeholder="Subjects (comma-separated)"
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSection())}
            />
            <button
              type="button"
              onClick={addSection}
              className="btn-primary flex items-center px-3"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {config.sections.map((section, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{section.name}</h3>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {section.subjects.map((subject, subIndex) => (
                  <span 
                    key={subIndex} 
                    className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {config.sections.length === 0 && (
          <p className="text-gray-500 text-center py-4">No sections added yet</p>
        )}
      </div>

      {/* Teacher-Subject Mapping */}
      {config.teachers.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
            Teacher-Subject Mapping
          </h2>
          
          <div className="space-y-4">
            {config.teachers.map((teacher, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {teacher} - Subjects
                </label>
                <input
                  type="text"
                  placeholder="Enter subjects this teacher can teach (comma-separated)"
                  className="input-field"
                  onChange={(e) => updateTeacherSubjects(teacher, e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: Mathematics, Physics, Computer Lab
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="btn-primary px-8 py-3 text-lg font-semibold"
        >
          Generate Timetable
        </button>
      </div>
    </form>
  );
};

export default ConfigForm;