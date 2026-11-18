import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import DeletedSites from './DeletedSites'
import DeletedManagers from './DeletedManagers';
import { useSelector } from 'react-redux';
import DeletedExpenses from './DeletedExpenses';
import DeletedWorkers from './DeletedWorkers';
import DeletedMemos from './DeletedMemos';
import { useParams, useNavigate } from 'react-router-dom';
import { RecycleSkeleton } from '../index'

function RecycleData() {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams()
  const navigate = useNavigate()

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
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedPage]);

  const handleBack = () => {
    navigate(`/site/${id}`);
  };

  return (
    <div className="w-full">

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

      {/* Header Section - Same layout as Workers page */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Left section */}
            <div className="flex items-center space-x-4">

              {user?.role === 'manager' && (
                <>
                  <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                  </button>

                  <div className="h-6 w-px bg-gray-300"></div>
                </>
              )}

              {/* Heading */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Recycle Bin
                  </h1>
                  <p className="text-sm text-gray-600">
                    Manage deleted items
                  </p>
                </div>
              </div>
            </div>

            {/* Right section - Navigation Tabs */}
            <div className="bg-gray-100 rounded-xl p-1 shadow-inner">

              {user.role === 'admin' && (
                <div className="grid grid-cols-2 gap-1 w-64">
                  <button
                    onClick={() => handlePageChange("sites")}
                    className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${
                      selectedPage === 'sites'
                        ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    Sites
                  </button>

                  <button
                    onClick={() => handlePageChange("managers")}
                    className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${
                      selectedPage === 'managers'
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
                    className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${
                      selectedPage === 'expenses'
                        ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    Expenses
                  </button>

                  <button
                    onClick={() => handlePageChange("workers")}
                    className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${
                      selectedPage === 'workers'
                        ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    Workers
                  </button>

                  <button
                    onClick={() => handlePageChange("memos")}
                    className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${
                      selectedPage === 'memos'
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
        </div>
      </nav>

      {/* Main Content - Padding kept separate from navbar */}
      <div className="px-6 pt-6">

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