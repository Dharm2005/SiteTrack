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
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      {isAuthenticated ? (
        <nav className="px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                SiteTrack
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              {/* Nav Items */}
              <ul className="flex space-x-2">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                      }`
                    }
                  >
                    {user?.role === 'admin' ? ('Sites') : ('My Sites') }
                  </NavLink>
                </li>
                {user?.role === 'admin' && (
                  <>
                    <li>
                      <NavLink
                        to="/all-manager"
                        className={({ isActive }) =>
                          `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                          }`
                        }
                      >
                        Managers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/recycle-bin"
                        className={({ isActive }) =>
                          `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                          }`
                        }
                      >
                        Recycle Bin
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>

              {/* User Profile Section */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  {/* Avatar with Role-based Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${user?.role === 'admin'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                      : 'bg-gradient-to-br from-teal-500 to-teal-600'
                    }`}>
                    {user?.role === 'admin' ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* User Details */}
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-800">{user?.username || 'User'}</span>
                    <span className={`text-xs font-medium capitalize ${user?.role === 'admin' ? 'text-amber-600' : 'text-teal-600'
                      }`}>
                      {user?.role || 'User'}
                    </span>
                  </div>

                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''
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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                    {/* Enhanced User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${user?.role === 'admin'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                            : 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                          }`}>
                          {/* User Initial */}
                          <span className="text-lg font-bold">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.username || 'User'}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-fit mt-1 ${user?.role === 'admin'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-teal-100 text-teal-700 border border-teal-200'
                            }`}>
                            {user?.role === 'admin' ? (
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                            {user?.role?.toUpperCase() || 'USER'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Manage your account
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="py-1">
                      {/* Change Password */}
                      <Link
                        to="auth/change-password"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors duration-200 flex items-center space-x-3 group"
                      >
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Change Password</span>
                          <p className="text-xs text-gray-500">Update your security</p>
                        </div>
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3 group border-t border-gray-100 mt-1"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-red-700">Sign Out</span>
                          <p className="text-xs text-red-500">End your session</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <Link
              to="/"
              className="flex items-center transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                Construction Sites
              </span>
            </Link>

            <div className="flex items-center space-x-3">
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`
                }
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-sm hover:shadow-md'
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