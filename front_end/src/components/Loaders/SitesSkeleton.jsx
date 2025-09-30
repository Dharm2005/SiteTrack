import React from "react";

const SitesSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Filter Skeleton */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="px-4 py-3 rounded-lg bg-gray-200 h-12 w-24"
            ></div>
          ))}
        </div>
      </div>

      {/* Sites Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex justify-between items-center pt-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SitesSkeleton