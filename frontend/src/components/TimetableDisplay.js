import React, { useState } from 'react';
import { Download, ArrowLeft, Calendar, Users } from 'lucide-react';

const TimetableDisplay = ({ data, onBack, onDownloadPDF }) => {
  const [viewType, setViewType] = useState('section'); // 'section' or 'teacher'
  const [selectedTarget, setSelectedTarget] = useState('');

  const { section_timetables, teacher_schedules, time_slots } = data;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = Array.from({ length: time_slots.length }, (_, i) => i + 1);

  // Set default selected target when view type changes
  React.useEffect(() => {
    if (viewType === 'section' && Object.keys(section_timetables).length > 0) {
      setSelectedTarget(Object.keys(section_timetables)[0]);
    } else if (viewType === 'teacher' && Object.keys(teacher_schedules).length > 0) {
      setSelectedTarget(Object.keys(teacher_schedules)[0]);
    }
  }, [viewType, section_timetables, teacher_schedules]);

  const getCurrentTimetable = () => {
    if (viewType === 'section') {
      return section_timetables[selectedTarget] || {};
    } else {
      return teacher_schedules[selectedTarget] || {};
    }
  };

  const getCellContent = (day, period) => {
    const timetable = getCurrentTimetable();
    const cellData = timetable[day]?.[period];
    
    if (!cellData) {
      return { content: 'Free', type: 'free' };
    }

    if (viewType === 'section') {
      return {
        content: (
          <div>
            <div className="font-medium">{cellData.subject}</div>
            <div className="text-xs text-gray-600">{cellData.teacher}</div>
          </div>
        ),
        type: cellData.type
      };
    } else {
      return {
        content: (
          <div>
            <div className="font-medium">{cellData.subject}</div>
            <div className="text-xs text-gray-600">{cellData.section}</div>
          </div>
        ),
        type: cellData.type
      };
    }
  };

  const getAvailableTargets = () => {
    if (viewType === 'section') {
      return Object.keys(section_timetables);
    } else {
      return Object.keys(teacher_schedules);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onBack}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Configuration</span>
        </button>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* View Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('section')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                viewType === 'section' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Sections</span>
            </button>
            <button
              onClick={() => setViewType('teacher')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                viewType === 'teacher' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Teachers</span>
            </button>
          </div>

          {/* Target Selector */}
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="input-field min-w-[150px]"
          >
            {getAvailableTargets().map(target => (
              <option key={target} value={target}>
                {target}
              </option>
            ))}
          </select>

          {/* Download Button */}
          <button
            onClick={() => onDownloadPDF(viewType, selectedTarget)}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Timetable */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {viewType === 'section' ? `Section ${selectedTarget}` : `${selectedTarget} - Teaching Schedule`}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="timetable-cell bg-gray-200 font-semibold text-gray-900">
                  Day / Period
                </th>
                {periods.map(period => (
                  <th key={period} className="timetable-cell bg-gray-200 font-semibold text-gray-900 min-w-[120px]">
                    <div>Period {period}</div>
                    <div className="text-xs font-normal text-gray-600">
                      {time_slots[period - 1]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.slice(0, data.working_days || 6).map(day => (
                <tr key={day}>
                  <td className="timetable-cell bg-gray-100 font-semibold text-gray-900">
                    {day}
                  </td>
                  {periods.map(period => {
                    const { content, type } = getCellContent(day, period);
                    return (
                      <td key={period} className={`timetable-cell ${type}`}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-sm text-gray-700">Regular Classes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-sm text-gray-700">Lab Sessions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-700">Sports/Library</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-sm text-gray-700">Free Periods</span>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-2">Total Sections</h4>
          <p className="text-2xl font-bold text-primary-600">
            {Object.keys(section_timetables).length}
          </p>
        </div>
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-2">Total Teachers</h4>
          <p className="text-2xl font-bold text-primary-600">
            {Object.keys(teacher_schedules).length}
          </p>
        </div>
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-2">Periods per Day</h4>
          <p className="text-2xl font-bold text-primary-600">
            {time_slots.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimetableDisplay;