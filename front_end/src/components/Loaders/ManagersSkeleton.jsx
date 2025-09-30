import React from "react";

export const SkeletonPulse = ({ className }) => (
  <div className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`} 
       style={{ animation: 'shimmer 1.5s infinite' }} />
);

const ManagerCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100" 
       style={{ animation: 'fadeIn 0.5s ease-out' }}>
    {/* Gradient Header */}
    <SkeletonPulse className="h-32 rounded-none" />
    
    {/* Avatar */}
    <div className="relative px-6 -mt-16 mb-4">
      <SkeletonPulse className="w-32 h-32 rounded-full border-4 border-white" />
    </div>

    {/* Content */}
    <div className="px-6 pb-6 space-y-4">
      {/* Name and Username */}
      <div className="space-y-2">
        <SkeletonPulse className="h-6 w-3/4 mx-auto" />
        <SkeletonPulse className="h-4 w-1/2 mx-auto" />
      </div>

      {/* Info Items */}
      <div className="space-y-3 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonPulse className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <SkeletonPulse className="h-3 w-20" />
              <SkeletonPulse className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <SkeletonPulse className="flex-1 h-10 rounded-lg" />
        <SkeletonPulse className="w-10 h-10 rounded-lg" />
      </div>
    </div>
  </div>
);

const ManagersSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
        <ManagerCardSkeleton />
      </div>
    ))}
  </div>
);

export default ManagersSkeleton