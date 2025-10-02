import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Manager from './Manager';
import ManagersSkeleton, { SkeletonPulse } from '../Loaders/ManagersSkeleton';

function Managers() {
  const allManagers = useSelector((state) => state.manager.managers)
  const { user } = useSelector(state => state.auth);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate loading effect
    if (allManagers !== undefined && allManagers !== null) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setShowContent(true), 50);
      }, 1000); // Adjust duration as needed

      return () => clearTimeout(timer);
    }
  }, [allManagers]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
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

        .stagger-item {
          opacity: 0;
          animation: slideIn 0.5s ease-out forwards;
        }

        .stagger-item:nth-child(1) { animation-delay: 0.1s; }
        .stagger-item:nth-child(2) { animation-delay: 0.2s; }
        .stagger-item:nth-child(3) { animation-delay: 0.3s; }
        .stagger-item:nth-child(4) { animation-delay: 0.4s; }
        .stagger-item:nth-child(5) { animation-delay: 0.5s; }
        .stagger-item:nth-child(6) { animation-delay: 0.6s; }
        .stagger-item:nth-child(7) { animation-delay: 0.7s; }
        .stagger-item:nth-child(8) { animation-delay: 0.8s; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between transition-all duration-700">
          {/* Left: Header Text + Add Button */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">All Managers</h2>
              {isLoading ? (
                <SkeletonPulse className="h-5 w-40" />
              ) : (
                <p className="text-gray-600 text-sm">
                  {allManagers?.length ? `${allManagers.length} managers found` : 'No managers available'}
                </p>
              )}
            </div>

            {/* Add Manager Button */}
            {!isLoading && allManagers && allManagers.length > 0 && user.role === 'admin' && (
              <Link
                to="/add-manager"
                className="group flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex-shrink-0"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Manager</span>
              </Link>
            )}
          </div>

          {/* Right: Filter Menu (Placeholder for future) */}
          <div className="flex items-center space-x-2">
            {/* Filter buttons will go here in the future */}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <ManagersSkeleton count={4} />
        ) : (
          <>
            {allManagers && allManagers.length > 0 ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${showContent ? '' : 'opacity-0'}`}>
                {allManagers.map((manager) => (
                  <div key={manager._id} className={showContent ? 'stagger-item' : ''}>
                    <Manager
                      id={manager._id}
                      name={manager.managerName}
                      image={manager.managerImage}
                      mobile={manager.managerMobile}
                      dob={manager.managerDob}
                      gender={manager.managerGender}
                      username={manager.userId.username}
                      createdAt={manager.createdAt}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className={`flex flex-col items-center justify-center py-16 ${showContent ? 'content-enter' : 'opacity-0'}`}>
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No managers found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  There are no managers to display at the moment. Add your first manager to get started.
                </p>
                {user.role === 'admin' && (
                  <Link
                    to='/add-manager'
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Add First Manager
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Managers