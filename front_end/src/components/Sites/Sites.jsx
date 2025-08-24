import React from 'react';
import Site from './Site';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Sites() {
  const allSites = useSelector((state) => state.site.sites)
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Sites</h2>
          <p className="text-gray-600">
            {allSites?.length ? `${allSites.length} sites found` : 'No sites available'}
          </p>
        </div>

        {/* Sites Grid */}
        {allSites && allSites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {allSites.map(site => (
              <div key={site._id} className="w-full">
                <Site
                  key={site._id}
                  id={site._id}
                  name={site.siteName}
                  location={site.location}
                  image={site.siteImage}
                  managerId={site.manager}
                  createdAt={site.createdAt}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No sites found</h3>
            <p className="text-gray-500 text-center max-w-md">
              There are no sites to display at the moment. Add your first site to get started.
            </p>
            <Link to='/add-site' className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
              Add First Site
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sites;