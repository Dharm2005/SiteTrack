import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../features/authSlice'; // Assuming you have this action

export default function NavBar() {

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {isAuthenticated ? (
        <nav className="px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center transition-transform duration-300 hover:scale-105"
            >
              {/* <img
                src="" // 
                className="h-10 mr-2"
                alt="Logo"
              /> */}
              <span className="font-bold text-xl text-gray-800">Construction Sites</span>
            </Link>

            <div className="flex items-center space-x-8">
              {/* Nav Items */}
              <ul className="flex space-x-8 font-medium">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `transition-colors duration-200 ${isActive
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700 hover:text-blue-700'
                      }`
                    }
                  >
                    Sites
                  </NavLink>
                </li>
                {user.role === 'admin' ? (
                  <>
                    <li>
                      <NavLink
                        to="/all-manager"
                        className={({ isActive }) =>
                          `transition-colors duration-200 ${isActive
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-700 hover:text-blue-700'
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
                          `transition-colors duration-200 ${isActive
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-700 hover:text-blue-700'
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
                          `transition-colors duration-200 ${isActive
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-700 hover:text-blue-700'
                          }`
                        }
                      >
                        Add Manager
                      </NavLink>
                    </li>
                  </>
                ) : (<></>)}
              </ul>

              {/* Authentication Buttons */}
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">

                    {/* Logout Button */}
                    <button
                      onClick={() => dispatch(logout())}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md transition-colors duration-200 transform hover:scale-105"
                    >
                      Logout
                    </button>
                  </div>
                ) : <></>}
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <Link
              to="/"
              className="flex items-center transition-transform duration-300 hover:scale-105"
            >
              {/* <img
                src="" // 
                className="h-10 mr-2"
                alt="Logo"
              /> */}
              <span className="font-bold text-xl text-gray-800">Construction Sites</span>
            </Link>
            <div className="flex items-center space-x-8">
              <ul className="flex space-x-8 font-medium">
                <li>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `transition-colors duration-200 ${isActive
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700 hover:text-blue-700'
                      }`
                    }
                  >
                    Sign-Up
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `transition-colors duration-200 ${isActive
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700 hover:text-blue-700'
                      }`
                    }
                  >
                    Log-In
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}