import React, { useEffect, useState } from 'react'
import { StickyNote, AlertCircle, Calendar, Clock, ChevronDown, ChevronUp, Edit3, Trash2, Loader2, Check } from 'lucide-react'
import { completeMemoInDB, deleteMemoFromDB } from '../../services/memoService';
import { useDispatch, useSelector } from "react-redux"
import { deleteMemo, updateMemo } from '../../features/memoSlice';

function Memo({ id, memoType, text, dueDate, createdAt }) {

  const { user } = useSelector(state => state.auth);

  const memo = useSelector(state =>
    state.memo.memos.find(m =>
      m._id === id
    )
  )

  const isCompleted = memo?.isCompleted || false;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [localIsCompleted, setLocalIsCompleted] = useState(isCompleted)
  const dispatch = useDispatch();


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
    if (memoType !== 'reminder' || !dueDate || localIsCompleted) return false;

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
    if (memoType !== 'reminder' || !dueDate || localIsCompleted) return false;

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
    if (localIsCompleted) return { color: 'gray', label: 'Completed', icon: Check };
    if (memoType === 'note') return { color: 'blue', label: 'Note', icon: StickyNote };

    if (isOverdue()) return { color: 'red', label: 'Overdue', icon: AlertCircle };
    if (isDueToday()) return { color: 'orange', label: 'Due Today', icon: AlertCircle };
    return { color: 'green', label: 'Reminder', icon: AlertCircle };
  };

  const handleComplete = async () => {
    const confirmed = window.confirm("Are you really want to mark completed this memo?");

    if (confirmed) {
      try {
        const res = await completeMemoInDB(id, { isCompleted: true })
        dispatch(updateMemo(res))
        setLocalIsCompleted(res.isCompleted);
      } catch (error) {
        console.error("Error while completing memo", error);
      }
    }
  }

  useEffect(() => {
    setLocalIsCompleted(isCompleted);
  }, [isCompleted])

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you really want to delete this memo?");

    if (confirmed) {
      setIsDeleting(true);
      setIsAnimatingOut(true);

      try {
        // Add a small delay to show the animation
        await new Promise(resolve => setTimeout(resolve, 300));
        await deleteMemoFromDB(id);

        // Wait for fade animation to complete before removing from store
        setTimeout(() => {
          dispatch(deleteMemo(id));
        }, 400);
      } catch (error) {
        console.error("Error while deleting memo", error);
        // Reset states on error
        setIsDeleting(false);
        setIsAnimatingOut(false);
      }
    }
  };

  const toggleExpanded = () => {
    if (!isDeleting) {
      setIsExpanded(!isExpanded);
    }
  };

  const priority = getPriorityStatus();
  const IconComponent = priority.icon;

  return (
    <div className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-500 border overflow-hidden relative ${localIsCompleted ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'
      } ${isAnimatingOut
        ? 'opacity-0 scale-95 transform translate-y-4'
        : 'opacity-100 scale-100 transform translate-y-0'
      } ${isDeleting ? 'pointer-events-none' : ''}`}>

      {/* Completed Banner */}
      {localIsCompleted && (
        <div className="bg-gray-200 border-b border-gray-300 p-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-1 bg-gray-300 rounded-lg">
              <Check className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Reminder Completed</span>
          </div>
        </div>
      )}

      {/* Compact Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Left Section - Memo Basic Info */}
          <div className="flex items-start space-x-3 flex-1">
            {/* Memo Type Icon */}
            <div className={`p-2 rounded-lg flex-shrink-0 ${localIsCompleted
                ? 'bg-gray-200'
                : priority.color === 'blue' ? 'bg-blue-100' :
                  priority.color === 'green' ? 'bg-green-100' :
                    priority.color === 'orange' ? 'bg-orange-100' :
                      'bg-red-100'
              }`}>
              <IconComponent className={`w-5 h-5 ${localIsCompleted
                  ? 'text-gray-500'
                  : priority.color === 'blue' ? 'text-blue-600' :
                    priority.color === 'green' ? 'text-green-600' :
                      priority.color === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                }`} />
            </div>

            {/* Memo Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${localIsCompleted
                    ? 'bg-gray-200 text-gray-600'
                    : priority.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      priority.color === 'green' ? 'bg-green-100 text-green-700' :
                        priority.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                  }`}>
                  {priority.label}
                </span>

                {memoType === 'reminder' && dueDate && (
                  <span className={`text-xs flex items-center ${localIsCompleted ? 'text-gray-500' : 'text-gray-500'}`}>
                    <Calendar className="w-3 h-3 mr-1" />
                    Due {formatDate(dueDate)}
                  </span>
                )}
              </div>

              <p className={`text-sm line-clamp-2 ${localIsCompleted ? 'text-gray-600' : 'text-gray-900'
                } ${isExpanded ? '' : 'truncate'}`}>
                {text || 'No memo text'}
              </p>

              <div className={`flex items-center text-xs mt-2 ${localIsCompleted ? 'text-gray-500' : 'text-gray-500'}`}>
                <Clock className="w-3 h-3 mr-1" />
                <span>Created {getRelativeTime(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Urgency Indicator */}
            {(isOverdue() || isDueToday()) && !localIsCompleted && (
              <div className={`w-2 h-2 rounded-full ${isOverdue() ? 'bg-red-500' : 'bg-orange-500'
                }`}></div>
            )}

            {user.role === 'manager' ? (
              <>

                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`p-1.5 rounded-lg transition-colors group flex items-center justify-center ${isDeleting
                    ? 'bg-red-100 cursor-not-allowed'
                    : localIsCompleted
                      ? 'hover:bg-gray-200'
                      : 'hover:bg-red-100'
                    }`}
                  title="Delete memo"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                  ) : (
                    <Trash2 className={`w-4 h-4 ${localIsCompleted
                        ? 'text-gray-500 group-hover:text-gray-600'
                        : 'text-gray-500 group-hover:text-red-600'
                      }`} />
                  )}
                </button>

                {/* Complete Button - Only show for reminders that are not completed */}
                {memoType === 'reminder' && !localIsCompleted && !isOverdue() && !isDueToday() && (
                  <button
                    onClick={handleComplete}
                    className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors font-medium"
                  >
                    Mark Complete
                  </button>
                )}
              </>
            ) : (<></>)}


            {/* Expand/Collapse Button */}
            <button
              onClick={toggleExpanded}
              disabled={isDeleting}
              className={`p-1.5 rounded-lg transition-all duration-200 ${isDeleting
                ? 'opacity-50 cursor-not-allowed'
                : localIsCompleted
                  ? 'hover:bg-gray-200'
                  : 'hover:bg-gray-100'
                }`}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className={`w-4 h-4 ${localIsCompleted ? 'text-gray-500' : 'text-gray-500'}`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${localIsCompleted ? 'text-gray-500' : 'text-gray-500'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details - Conditionally Visible */}
      {isExpanded && !isDeleting && (
        <div className={`border-t overflow-hidden ${localIsCompleted ? 'border-gray-200 bg-gray-50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="p-4 space-y-4">
            {/* Full Text */}
            <div className={`rounded-lg p-3 shadow-sm ${localIsCompleted ? 'bg-gray-100' : 'bg-white'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <StickyNote className={`w-4 h-4 ${localIsCompleted ? 'text-gray-500' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${localIsCompleted ? 'text-gray-600' : 'text-gray-700'}`}>Full Text</span>
              </div>
              <p className={`text-sm whitespace-pre-wrap ${localIsCompleted ? 'text-gray-600' : 'text-gray-900'}`}>
                {text || 'No memo text provided'}
              </p>
            </div>

            {/* Memo Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Created Date */}
              <div className={`rounded-lg p-3 shadow-sm ${localIsCompleted ? 'bg-gray-100' : 'bg-white'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`p-1 rounded ${localIsCompleted ? 'bg-gray-200' : 'bg-blue-100'}`}>
                    <Clock className={`w-3 h-3 ${localIsCompleted ? 'text-gray-500' : 'text-blue-600'}`} />
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-wide ${localIsCompleted ? 'text-gray-500' : 'text-gray-500'}`}>
                    Created
                  </span>
                </div>
                <p className={`text-sm font-semibold ${localIsCompleted ? 'text-gray-600' : 'text-gray-900'}`}>
                  {formatDate(createdAt)}
                </p>
              </div>

              {/* Due Date (if reminder) */}
              {memoType === 'reminder' && dueDate && (
                <div className={`rounded-lg p-3 shadow-sm ${localIsCompleted ? 'bg-gray-100' : 'bg-white'}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`p-1 rounded ${localIsCompleted
                        ? 'bg-gray-200'
                        : isOverdue() ? 'bg-red-100' : isDueToday() ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                      <Calendar className={`w-3 h-3 ${localIsCompleted
                          ? 'text-gray-500'
                          : isOverdue() ? 'text-red-600' : isDueToday() ? 'text-orange-600' : 'text-green-600'
                        }`} />
                    </div>
                    <span className={`text-xs font-medium uppercase tracking-wide ${localIsCompleted ? 'text-gray-500' : 'text-gray-500'}`}>
                      Due Date
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${localIsCompleted
                      ? 'text-gray-600'
                      : isOverdue() ? 'text-red-600' : isDueToday() ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                    {formatDate(dueDate)}
                    {!localIsCompleted && isOverdue() && <span className="text-xs ml-1">(Overdue)</span>}
                    {!localIsCompleted && isDueToday() && <span className="text-xs ml-1">(Today)</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className={`flex items-center justify-between pt-2 border-t ${localIsCompleted ? 'border-gray-300' : 'border-gray-200'}`}>
              <div className={`text-xs ${localIsCompleted ? 'text-gray-500' : 'text-gray-500'}`}>
                Memo ID: #{id}
              </div>


            </div>
          </div>
        </div>
      )}

      {/* Deleting Overlay - Covers entire memo */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center rounded-xl z-10">
          <div className="bg-red-50 rounded-full p-4 mb-3">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
          <span className="text-sm text-red-600 font-medium">Deleting memo...</span>
        </div>
      )}
    </div>
  )
}

export default Memo