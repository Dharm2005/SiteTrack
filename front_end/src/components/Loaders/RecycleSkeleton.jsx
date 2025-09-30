import React from "react";

const SkeletonPulse = ({ className }) => (
  <div className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`} 
       style={{ animation: 'shimmer 1.5s infinite' }} />
);

const ManagerRecycleSkeletonRow = () => (
  <div className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100" 
       style={{ animation: 'fadeIn 0.5s ease-out' }}>
    <div className="flex items-center gap-6">
      <SkeletonPulse className="w-16 h-16 rounded-lg" />
      <div className="flex-1 grid grid-cols-7 gap-4 items-center">
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-3 w-16" />
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-20" />
          <SkeletonPulse className="h-3 w-14" />
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-28" />
          <SkeletonPulse className="h-3 w-20" />
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-16" />
          <SkeletonPulse className="h-3 w-12" />
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-32" />
          <SkeletonPulse className="h-3 w-24" />
        </div>
      </div>
      <div className="flex gap-2">
        <SkeletonPulse className="w-10 h-10 rounded-lg" />
        <SkeletonPulse className="w-10 h-10 rounded-lg" />
      </div>
    </div>
  </div>
);

const AdminRecycleSkeletonRow = () => (
  <div className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100" 
       style={{ animation: 'fadeIn 0.5s ease-out' }}>
    <div className="flex items-center gap-6">
      <SkeletonPulse className="w-20 h-20 rounded-lg" />
      <div className="flex-1 grid grid-cols-3 gap-8 items-center">
        <div className="space-y-3">
          <SkeletonPulse className="h-5 w-32" />
          <SkeletonPulse className="h-3 w-48" />
        </div>
        <div className="space-y-3">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-4 w-28" />
        </div>
        <div className="space-y-3">
          <SkeletonPulse className="h-4 w-36" />
        </div>
      </div>
      <div className="flex gap-2">
        <SkeletonPulse className="w-10 h-10 rounded-lg" />
        <SkeletonPulse className="w-10 h-10 rounded-lg" />
      </div>
    </div>
  </div>
);

const RecycleSkeleton = ({ rows = 3, isAdmin = false }) => (
  <div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
        {isAdmin ? <AdminRecycleSkeletonRow /> : <ManagerRecycleSkeletonRow />}
      </div>
    ))}
  </div>
);

export default RecycleSkeleton