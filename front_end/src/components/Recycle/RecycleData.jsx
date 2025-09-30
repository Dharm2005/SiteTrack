import React, { useState, useEffect } from 'react'
import DeletedSites from './DeletedSites'
import DeletedManagers from './DeletedManagers';
import { useSelector } from 'react-redux';
import DeletedExpenses from './DeletedExpenses';
import DeletedWorkers from './DeletedWorkers';
import DeletedMemos from './DeletedMemos';
import { useParams } from 'react-router-dom';
import {RecycleSkeleton} from '../index'

function RecycleData() {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams()
  
  // Conditional default value based on user role
  const getDefaultPage = () => {
    if (user?.role === 'admin') {
      return 'sites';
    } else if (user?.role === 'manager') {
      return 'expenses';
    }
    return ''
  };

  const [selectedPage, setSelectedPage] = useState(getDefaultPage());
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Handle page change with loading state
  const handlePageChange = (page) => {
    setShowContent(false);
    setIsLoading(true);
    setSelectedPage(page);
  };

  // Simulate loading when page changes
  useEffect(() => {
    setIsLoading(true);
    setShowContent(false);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Small delay before showing content for smooth transition
      setTimeout(() => setShowContent(true), 50);
    }, 800); // Adjust this duration as needed

    return () => clearTimeout(timer);
  }, [selectedPage]);

  return (
    <div className="px-6 pt-6">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-enter {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>

      <nav className="mb-6">
        <div className="flex items-center justify-between">
          {/* Left side - Heading */}
          <div className="flex items-center">
            <div className="mr-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
              <p className="text-sm text-gray-500 mt-1">Manage deleted items</p>
            </div>
          </div>

          {/* Right side - Navigation Tabs */}
          <div className="bg-gray-100 rounded-xl p-1 shadow-inner">
            {user.role === 'admin' && (
              <div className="grid grid-cols-2 gap-1 w-64">
                <button
                  onClick={() => handlePageChange("sites")}
                  className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'sites'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Sites
                </button>
                <button
                  onClick={() => handlePageChange("managers")}
                  className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'managers'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Managers
                </button>
              </div>
            )}
            {user.role === 'manager' && (
              <div className="grid grid-cols-3 gap-1 w-80">
                <button
                  onClick={() => handlePageChange("expenses")}
                  className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'expenses'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => handlePageChange("workers")}
                  className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'workers'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Workers
                </button>
                <button
                  onClick={() => handlePageChange("memos")}
                  className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'memos'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Memos
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div>
        {isLoading ? (
          <RecycleSkeleton 
            rows={3} 
            isAdmin={selectedPage === 'sites' || selectedPage === 'managers'} 
          />
        ) : (
          <div className={showContent ? 'content-enter' : ''}>
            {selectedPage === 'sites' && (
              <DeletedSites />
            )}
            {selectedPage === 'managers' && (
              <DeletedManagers />
            )}
            {selectedPage === 'expenses' && (
              <DeletedExpenses siteId={id} />
            )}
            {selectedPage === 'workers' && (
              <DeletedWorkers siteId={id} />
            )}
            {selectedPage === 'memos' && (
              <DeletedMemos siteId={id} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecycleData