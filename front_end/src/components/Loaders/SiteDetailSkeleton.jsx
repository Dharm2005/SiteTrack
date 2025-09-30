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

const SkeletonCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
)

// Site Detail Skeleton
const SiteDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Back Button Skeleton */}
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <SkeletonBox className="w-5 h-5 rounded" />
        <SkeletonBox className="w-12 h-5 rounded" />
      </div>
      <div className="flex items-center space-x-4">
        <SkeletonBox className="w-24 h-8 rounded-lg" />
        <SkeletonBox className="w-20 h-6 rounded-full" />
      </div>
    </div>

    <div className="px-6 pb-6 max-w-7xl mx-auto">
      {/* Top Section Skeleton */}
      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Left Side - Site and Manager Details Skeleton */}
        <div className="lg:col-span-3">
          <SkeletonCard className="h-full">
            {/* Site Header Skeleton */}
            <div className="relative h-40">
              <SkeletonBox className="w-full h-full" />
              {/* Manager Image Skeleton */}
              <div className="absolute top-3 right-3 w-12 h-12 rounded-full">
                <SkeletonBox className="w-full h-full rounded-full" />
              </div>
              {/* Site Name Skeleton */}
              <div className="absolute bottom-4 left-4">
                <SkeletonBox className="w-48 h-8 rounded" />
              </div>
            </div>

            {/* Details Skeleton */}
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Site Information Skeleton */}
                <div>
                  <div className="flex items-center mb-4">
                    <SkeletonBox className="w-4 h-4 rounded mr-2" />
                    <SkeletonBox className="w-32 h-5 rounded" />
                  </div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-1">
                        <SkeletonBox className="w-16 h-4 rounded" />
                        <SkeletonBox className="w-24 h-4 rounded" />
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-100">
                      <SkeletonBox className="w-40 h-12 rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Manager Information Skeleton */}
                <div>
                  <div className="flex items-center mb-4">
                    <SkeletonBox className="w-4 h-4 rounded mr-2" />
                    <SkeletonBox className="w-24 h-5 rounded" />
                  </div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-1">
                        <SkeletonBox className="w-12 h-4 rounded" />
                        <SkeletonBox className="w-28 h-4 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SkeletonCard>
        </div>

        {/* Right Side - Navigation Cards Skeleton */}
        <div className="lg:col-span-2 flex flex-col space-y-4 h-full">
          {/* Workers Card Skeleton */}
          <SkeletonCard className="flex-1">
            <div className="p-6">
              <SkeletonBox className="w-full h-20 rounded" />
            </div>
            <div className="p-6 bg-gray-50">
              <SkeletonBox className="w-32 h-5 rounded" />
            </div>
          </SkeletonCard>

          {/* Expenses Card Skeleton */}
          <SkeletonCard className="flex-1">
            <div className="p-6">
              <SkeletonBox className="w-full h-20 rounded" />
            </div>
            <div className="p-6 bg-gray-50">
              <SkeletonBox className="w-32 h-5 rounded" />
            </div>
          </SkeletonCard>
        </div>
      </div>

      {/* Notes & Reminders Skeleton */}
      <SkeletonCard>
        <div className="p-4">
          <SkeletonBox className="w-full h-16 rounded" />
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <SkeletonBox className="w-full h-32 rounded" />
            <SkeletonBox className="w-3/4 h-20 rounded" />
          </div>
        </div>
      </SkeletonCard>
    </div>
  </div>
)

export default SiteDetailSkeleton