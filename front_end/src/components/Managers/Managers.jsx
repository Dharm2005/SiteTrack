import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Manager from './Manager';
import Loader from '../Layout/Loader';

function Managers() {
  const allManagers = useSelector((state) => state.manager.managers)
  const { user } = useSelector(state => state.auth);

  if (!allManagers) {
    return (
      <div className="flex justify-center items-center h-screen w-full -mt-12">
        <Loader message={"Loading managers..."} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Managers</h2>
            <p className="text-gray-600">
              {allManagers?.length ? `${allManagers.length} managers found` : 'No managers available'}
            </p>
          </div>

          {allManagers && allManagers.length > 0 && (
            user.role === 'admin' ? (
              <Link
                to='/add-manager'
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Add New Manager
              </Link>
            ) : null
          )}

        </div>

        {/* Managers Grid */}
        {allManagers && allManagers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allManagers.map(manager => (
              <Manager
                key={manager._id}
                id={manager._id}
                name={manager.managerName}
                image={manager.managerImage}
                mobile={manager.managerMobile}
                dob={manager.managerDob}
                gender={manager.managerGender}
                username={manager.userId.username}
                createdAt={manager.createdAt}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No managers found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              There are no managers to display at the moment. Add your first manager to get started.
            </p>
            <Link
              to='/add-manager'
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Add First Manager
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Managers