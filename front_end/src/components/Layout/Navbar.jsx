import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../features/authSlice';

export default function NavBar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      {isAuthenticated ? (
        <nav className="px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Construction Sites
              </span>
            </Link>

            <div className="flex items-center space-x-8">
              {/* Nav Items */}
              <ul className="flex space-x-6 font-medium">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    Sites
                  </NavLink>
                </li>
                {user?.role === 'admin' && (
                  <>
                    <li>
                      <NavLink
                        to="/all-manager"
                        className={({ isActive }) =>
                          `px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`
                        }
                      >
                        Managers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/add-site"
                        className={({ isActive }) =>
                          `px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`
                        }
                      >
                        Add Site
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/add-manager"
                        className={({ isActive }) =>
                          `px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'text-blue-600 bg-blue-50 font-semibold shadow-sm'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`
                        }
                      >
                        Add Manager
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>

              {/* User Profile Section */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:from-gray-100 hover:to-gray-150 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {/* Avatar with Role-based Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${
                    user?.role === 'admin' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-700' 
                      : 'bg-gradient-to-br from-green-500 to-green-700'
                  }`}>
                    {user?.role === 'admin' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* User Details */}
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-800">{user?.username || 'User'}</span>
                    <span className={`text-xs font-medium capitalize ${
                      user?.role === 'admin' ? 'text-orange-600' : 'text-indigo-600'
                    }`}>
                      {user?.role || 'User'}
                    </span>
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <svg 
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      isProfileDropdownOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md relative overflow-hidden ${
                          user?.role === 'admin' 
                            ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700' 
                            : 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700'
                        }`}>
                          {/* User Initial as main display */}
                          <span className="text-xl font-bold">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                          
                          {/* Small role indicator badge */}
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md ${
                            user?.role === 'admin' 
                              ? 'bg-blue-600 border-2 border-white' 
                              : 'bg-emerald-600 border-2 border-white'
                          }`}>
                            {user?.role === 'admin' ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-800">{user?.username || 'User'}</p>
                          <div className="flex items-center space-x-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              user?.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user?.role === 'admin' ? (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || 'User'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <Link
              to="/"
              className="flex items-center transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Construction Sites
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 shadow-sm'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-105 ${
                    isActive
                      ? 'bg-blue-700 shadow-lg'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  }`
                }
              >
                Log In
              </NavLink>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}