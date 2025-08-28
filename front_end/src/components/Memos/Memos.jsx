import React, { useEffect, useState } from 'react'
import { getMemosBySite } from '../../services/memoService'
import Memo from './Memo'
import AddMemoForm from './AddMemoForm'
import { useDispatch, useSelector } from 'react-redux';
import { setMemos } from '../../features/memoSliice';
import { Plus, StickyNote, Filter, Search, AlertCircle, Calendar } from 'lucide-react'

function Memos({ siteId }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, note, reminder
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, dueDate

  const allMemos = useSelector(state => state.memo.memos)
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

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(memo => 
        memo.text.toLowerCase().includes(query)
      );
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
    if (!allMemos) return { all: 0, note: 0, reminder: 0, overdue: 0 };
    
    const counts = {
      all: allMemos.length,
      note: allMemos.filter(memo => memo.memoType === 'note').length,
      reminder: allMemos.filter(memo => memo.memoType === 'reminder').length,
      overdue: 0
    };

    // Count overdue reminders
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    counts.overdue = allMemos.filter(memo => {
      if (memo.memoType !== 'reminder' || !memo.dueDate) return false;
      try {
        const due = new Date(memo.dueDate);
        return due < now;
      } catch (error) {
        console.log(error);
        
        return false;
      }
    }).length;

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
        
        {!showAddForm && (
          <button
            onClick={handleShowForm}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Memo</span>
          </button>
        )}
      </div>

      {/* Add Memo Form - Only show when needed */}
      {showAddForm && (
        <AddMemoForm 
          siteId={siteId}
          onClose={handleCloseForm}
        />
      )}

      {/* Filters and Search - Only show when there are memos */}
      {allMemos && allMemos.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search memos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All', count: counts.all },
                  { key: 'note', label: 'Notes', count: counts.note },
                  { key: 'reminder', label: 'Reminders', count: counts.reminder },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterType === filter.key
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
              memoType={memo.memoType}
              text={memo.text}
              dueDate={memo.dueDate}
              createdAt={memo.createdAt}
            />
          ))}
        </div>
      ) : allMemos && allMemos.length > 0 ? (
        /* No Results State */
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memos found</h3>
          <p className="text-gray-500 text-center max-w-md mb-4">
            {searchQuery ? `No memos match "${searchQuery}"` : `No ${filterType} memos found`}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
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
          <p className="text-gray-500 text-center max-w-md mb-6">
            Keep track of important information and set reminders for this site. Add your first memo to get started.
          </p>
          {!showAddForm && (
            <button
              onClick={handleShowForm}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Memo</span>
            </button>
          )}
        </div>
      )}

      {/* Quick Stats - Only show when there are memos */}
      {allMemos && allMemos.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <StickyNote className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Notes</p>
                <p className="text-xl font-bold text-gray-900">{counts.note}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Reminders</p>
                <p className="text-xl font-bold text-gray-900">{counts.reminder}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Due Today</p>
                <p className="text-xl font-bold text-gray-900">
                  {allMemos.filter(memo => {
                    if (memo.memoType !== 'reminder' || !memo.dueDate) return false;
                    try {
                      const due = new Date(memo.dueDate);
                      const today = new Date();
                      due.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);
                      return due.getTime() === today.getTime();
                    } catch (error) {
                      console.log(error);
                      
                      return false;
                    }
                  }).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-xl font-bold text-red-600">{counts.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Memos