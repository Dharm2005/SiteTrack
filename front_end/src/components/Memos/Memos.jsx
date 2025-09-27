import React, { useEffect, useState } from 'react'
import { getMemosBySite } from '../../services/memoService'
import Memo from './Memo'
import AddMemoForm from './AddMemoForm'
import { useDispatch, useSelector } from 'react-redux';
import { setMemos } from '../../features/memoSlice';
import { Plus, StickyNote, Filter, AlertCircle, Calendar, Edit3, Trash2 } from 'lucide-react'

function Memos({ siteId, isCompleted }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, note, reminder
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, dueDate

  const allMemos = useSelector(state => state.memo.memos)
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const allMemos = await getMemosBySite(siteId);
        dispatch(setMemos(allMemos))
      } catch (error) {
        console.error("Error fetching memos:", error);
      }
    }
    fetchMemos()
  }, [siteId, dispatch])

  // Filter and sort memos
  const getFilteredAndSortedMemos = () => {
    if (!allMemos) return [];

    let filtered = [...allMemos];

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(memo => memo.memoType === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'dueDate':
          if (a.memoType === 'reminder' && b.memoType === 'reminder') {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          }
          if (a.memoType === 'reminder') return -1;
          if (b.memoType === 'reminder') return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const filteredMemos = getFilteredAndSortedMemos();

  // Get counts for filter badges
  const getCounts = () => {
    if (!allMemos) return { all: 0, note: 0, reminder: 0, overdue: 0, dueToday: 0 };

    const counts = {
      all: allMemos.length,
      note: allMemos.filter(memo => memo.memoType === 'note').length,
      reminder: allMemos.filter(memo => memo.memoType === 'reminder').length,
      overdue: 0,
      dueToday: 0
    };

    // Count overdue and due today reminders
    const now = new Date();
    const today = new Date();
    now.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    allMemos.forEach(memo => {
      if (memo.memoType === 'reminder' && memo.dueDate) {
        try {
          const due = new Date(memo.dueDate);
          due.setHours(0, 0, 0, 0);

          if (due < now) {
            counts.overdue++;
          } else if (due.getTime() === today.getTime()) {
            counts.dueToday++;
          }
        } catch (error) {
          console.log(error);
        }
      }
    });

    return counts;
  };

  const counts = getCounts();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <StickyNote className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notes & Reminders</h2>
            <p className="text-gray-600">
              {counts.all ? `${counts.all} memo${counts.all !== 1 ? 's' : ''} found` : 'No memos available'}
              {counts.overdue > 0 && (
                <span className="ml-2 text-red-600 font-medium">
                  • {counts.overdue} overdue
                </span>
              )}
            </p>
          </div>
        </div>
        {!isCompleted && (
          <>
            {user.role === 'manager' ? (
              <>
                {!showAddForm && (
                  <button
                    onClick={handleShowForm}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Memo</span>
                  </button>
                )}
              </>
            ) : (<></>)
            }
          </>
        )}

      </div>

      {/* Add Memo Form - Only show when needed */}
      {showAddForm && (
        <AddMemoForm
          siteId={siteId}
          onClose={handleCloseForm}
        />
      )}

      {/* Quick Stats - Compact Summary */}
      {allMemos && allMemos.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <StickyNote className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">Total Notes</p>
                <p className="text-lg font-bold text-gray-900">{counts.note}</p>
              </div>
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">Active Reminders</p>
                <p className="text-lg font-bold text-gray-900">{counts.reminder}</p>
              </div>
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">Due Today</p>
                <p className="text-lg font-bold text-gray-900">{counts.dueToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600 truncate">Overdue</p>
                <p className="text-lg font-bold text-red-600">{counts.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort - Only show when there are memos */}
      {allMemos && allMemos.length > 0 && (
        <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex space-x-1">
                {[
                  { key: 'all', label: 'All', count: counts.all },
                  { key: 'note', label: 'Notes', count: counts.note },
                  { key: 'reminder', label: 'Reminders', count: counts.reminder },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === filter.key
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {filter.label}
                    <span className="ml-1 text-xs">({filter.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Memos List */}
      {filteredMemos && filteredMemos.length > 0 ? (
        <div className="grid gap-4">
          {filteredMemos.map(memo => (
            <Memo
              key={memo._id}
              id={memo._id}
              siteId={siteId}
              memoType={memo.memoType}
              text={memo.text}
              dueDate={memo.dueDate}
              createdAt={memo.createdAt}
              isSiteCompleted={isCompleted}
            />
          ))}
        </div>
      ) : allMemos && allMemos.length > 0 ? (
        /* No Results State */
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <StickyNote className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memos found</h3>
          <p className="text-gray-500 text-center max-w-md mb-4">
            No {filterType} memos found
          </p>
          <button
            onClick={() => setFilterType('all')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <StickyNote className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No memos yet</h3>
          {user.role === 'manager' ? (
            <>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Keep track of important information and set reminders for this site. Add your first memo to get started.
              </p>
              {!isCompleted ? (
                <>
                  {!showAddForm && (
                    <button
                      onClick={handleShowForm}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Memo</span>
                    </button>
                  )}
                </>
              ) : (<></>)}

            </>
          ) : (<></>)}
        </div>
      )}
    </div>
  )
}

export default Memos