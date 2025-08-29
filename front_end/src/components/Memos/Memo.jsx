import React, { useState } from 'react'
import { StickyNote, AlertCircle, Calendar, Clock, ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react'

function Memo({ id, memoType, text, dueDate, createdAt }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error(error);
      return 'Invalid Date';
    }
  };

  // Format relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays} days ago`;
      if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch (error) {
      console.log(error);
      
      return '';
    }
  };

  // Check if reminder is overdue
  const isOverdue = () => {
    if (memoType !== 'reminder' || !dueDate) return false;
    
    try {
      const due = new Date(dueDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return due < now;
    } catch (error) {
      console.log(error);
      
      return false;
    }
  };

  // Check if reminder is due today
  const isDueToday = () => {
    if (memoType !== 'reminder' || !dueDate) return false;
    
    try {
      const due = new Date(dueDate);
      const now = new Date();
      due.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      return due.getTime() === now.getTime();
    } catch (error) {
      console.log(error);
      
      return false;
    }
  };

  // Get priority status
  const getPriorityStatus = () => {
    if (memoType === 'note') return { color: 'blue', label: 'Note', icon: StickyNote };
    
    if (isOverdue()) return { color: 'red', label: 'Overdue', icon: AlertCircle };
    if (isDueToday()) return { color: 'orange', label: 'Due Today', icon: AlertCircle };
    return { color: 'green', label: 'Reminder', icon: AlertCircle };
  };

  const handleEdit = () => {
    console.log('Edit memo:', id);
  };

  const handleDelete = () => {
    console.log('Delete memo:', id);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const priority = getPriorityStatus();
  const IconComponent = priority.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Compact Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Left Section - Memo Basic Info */}
          <div className="flex items-start space-x-3 flex-1">
            {/* Memo Type Icon */}
            <div className={`p-2 rounded-lg flex-shrink-0 ${
              priority.color === 'blue' ? 'bg-blue-100' :
              priority.color === 'green' ? 'bg-green-100' :
              priority.color === 'orange' ? 'bg-orange-100' :
              'bg-red-100'
            }`}>
              <IconComponent className={`w-5 h-5 ${
                priority.color === 'blue' ? 'text-blue-600' :
                priority.color === 'green' ? 'text-green-600' :
                priority.color === 'orange' ? 'text-orange-600' :
                'text-red-600'
              }`} />
            </div>

            {/* Memo Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  priority.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  priority.color === 'green' ? 'bg-green-100 text-green-700' :
                  priority.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {priority.label}
                </span>
                
                {memoType === 'reminder' && dueDate && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Due {formatDate(dueDate)}
                  </span>
                )}
              </div>
              
              <p className={`text-sm text-gray-900 line-clamp-2 ${isExpanded ? '' : 'truncate'}`}>
                {text || 'No memo text'}
              </p>
              
              <div className="flex items-center text-gray-500 text-xs mt-2">
                <Clock className="w-3 h-3 mr-1" />
                <span>Created {getRelativeTime(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Urgency Indicator */}
            {(isOverdue() || isDueToday()) && (
              <div className={`w-2 h-2 rounded-full ${
                isOverdue() ? 'bg-red-500' : 'bg-orange-500'
              }`}></div>
            )}

            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors group"
              title="Edit memo"
            >
              <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
              title="Delete memo"
            >
              <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
            </button>

            {/* Expand/Collapse Button */}
            <button
              onClick={toggleExpanded}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details - Conditionally Visible */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-4 space-y-4">
            {/* Full Text */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <StickyNote className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Full Text</span>
              </div>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {text || 'No memo text provided'}
              </p>
            </div>

            {/* Memo Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Created Date */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 bg-blue-100 rounded">
                    <Clock className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Created
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(createdAt)}
                </p>
              </div>

              {/* Due Date (if reminder) */}
              {memoType === 'reminder' && dueDate && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`p-1 rounded ${
                      isOverdue() ? 'bg-red-100' : isDueToday() ? 'bg-orange-100' : 'bg-green-100'
                    }`}>
                      <Calendar className={`w-3 h-3 ${
                        isOverdue() ? 'text-red-600' : isDueToday() ? 'text-orange-600' : 'text-green-600'
                      }`} />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Due Date
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${
                    isOverdue() ? 'text-red-600' : isDueToday() ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {formatDate(dueDate)}
                    {isOverdue() && <span className="text-xs ml-1">(Overdue)</span>}
                    {isDueToday() && <span className="text-xs ml-1">(Today)</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Memo ID: #{id}
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md hover:bg-purple-200 transition-colors font-medium">
                  Edit Memo
                </button>
                {memoType === 'reminder' && !isOverdue() && !isDueToday() && (
                  <button className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors font-medium">
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Memo