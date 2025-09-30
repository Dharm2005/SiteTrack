import React from "react";

const SkeletonBox = ({ className = "", animate = true }) => (
  <div className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}></div>
)

const SkeletonText = ({ lines = 1, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <SkeletonBox
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
)

// Worker Card Skeleton
const WorkerCardSkeleton = () => (
  <div className="flex-shrink-0 w-32">
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-col items-center">
        <SkeletonBox className="w-16 h-16 rounded-full mb-3" />
        <SkeletonBox className="w-20 h-4 rounded mb-2" />
        <SkeletonBox className="w-24 h-3 rounded mb-2" />
        <SkeletonBox className="w-16 h-3 rounded" />
      </div>
    </div>
  </div>
)

// Workers Section Skeleton
const WorkersSkeleton = () => (
  <div className="h-full flex flex-col">
    {/* Header Skeleton */}
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left section skeleton */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SkeletonBox className="w-5 h-5 rounded" />
              <SkeletonBox className="w-12 h-5 rounded" />
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <SkeletonBox className="w-9 h-9 rounded-lg" />
              <div>
                <SkeletonBox className="w-28 h-6 rounded mb-1" />
                <SkeletonBox className="w-36 h-4 rounded" />
              </div>
            </div>
          </div>
          {/* Right section skeleton */}
          <SkeletonBox className="w-28 h-10 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="flex-1 flex flex-col px-4 pt-6 pb-4">
      {/* Workers Section Skeleton */}
      <div className="flex-shrink-0 mb-6">
        <div className="overflow-x-auto pb-2 p-2">
          <div className="flex space-x-4 min-w-max">
            {[...Array(8)].map((_, i) => (
              <WorkerCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Worker Detail Section Skeleton */}
      <div className="flex-1 min-h-0">
        <div className="bg-white rounded-lg shadow-sm border h-full p-6">
          <div className="space-y-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-3">
                <SkeletonBox className="w-12 h-12 rounded-full" />
                <div>
                  <SkeletonBox className="w-32 h-6 rounded mb-2" />
                  <SkeletonBox className="w-24 h-4 rounded" />
                </div>
              </div>
              <SkeletonBox className="w-24 h-8 rounded-lg" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <SkeletonBox className="w-8 h-8 rounded-lg mb-3" />
                  <SkeletonBox className="w-16 h-6 rounded mb-1" />
                  <SkeletonBox className="w-20 h-4 rounded" />
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                <SkeletonBox className="w-40 h-6 rounded" />
                <div className="grid gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <SkeletonBox className="w-32 h-5 rounded mb-2" />
                          <SkeletonBox className="w-24 h-4 rounded" />
                        </div>
                        <SkeletonBox className="w-20 h-5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default WorkersSkeleton