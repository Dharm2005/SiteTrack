import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
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

          {/* Nav Items */}
          <ul className="flex space-x-8 font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 hover:text-blue-700'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/add-site"
                className={({ isActive }) =>
                  `transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 hover:text-blue-700'
                  }`
                }
              >
                Add Site
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
