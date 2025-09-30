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
  <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}>
    {children}
  </div>
)

// Expenses List Item Skeleton
const ExpenseItemSkeleton = () => (
  <div className="p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        <SkeletonBox className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <SkeletonBox className="w-24 h-5 rounded" />
            <SkeletonBox className="w-16 h-4 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SkeletonText lines={2} />
            <SkeletonText lines={2} />
          </div>
        </div>
      </div>
      <div className="text-right">
        <SkeletonBox className="w-20 h-6 rounded mb-1" />
        <SkeletonBox className="w-16 h-4 rounded" />
      </div>
    </div>
  </div>
)

// Main Expenses Skeleton
const ExpensesSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
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
                <SkeletonBox className="w-32 h-6 rounded mb-1" />
                <SkeletonBox className="w-40 h-4 rounded" />
              </div>
            </div>
          </div>
          {/* Right section skeleton */}
          <SkeletonBox className="w-28 h-10 rounded-lg" />
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Stats and Chart Grid Skeleton */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* Left: Stats Card Skeleton */}
        <div className="col-span-3">
          <SkeletonCard className="p-6 h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <SkeletonBox className="w-20 h-4 rounded mb-2" />
                  <SkeletonBox className="w-24 h-8 rounded" />
                </div>
                <SkeletonBox className="w-12 h-12 rounded-lg" />
              </div>
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <SkeletonBox className="w-24 h-4 rounded mb-2" />
                    <SkeletonBox className="w-16 h-8 rounded" />
                  </div>
                  <SkeletonBox className="w-12 h-12 rounded-lg" />
                </div>
              </div>
            </div>
          </SkeletonCard>
        </div>

        {/* Center: Chart Skeleton */}
        <div className="col-span-6">
          <SkeletonCard className="p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <SkeletonBox className="w-32 h-6 rounded" />
              <SkeletonBox className="w-24 h-4 rounded" />
            </div>
            <SkeletonBox className="w-full h-64 rounded-lg" />
          </SkeletonCard>
        </div>

        {/* Right: Filters Skeleton */}
        <div className="col-span-3">
          <SkeletonCard className="p-4 h-full">
            <div className="flex items-center justify-between mb-3">
              <SkeletonBox className="w-16 h-5 rounded" />
              <SkeletonBox className="w-12 h-4 rounded" />
            </div>
            <div className="space-y-3">
              {/* Date Range */}
              <div>
                <SkeletonBox className="w-20 h-4 rounded mb-1" />
                <div className="grid grid-cols-2 gap-2">
                  <SkeletonBox className="w-full h-8 rounded" />
                  <SkeletonBox className="w-full h-8 rounded" />
                </div>
              </div>
              {/* Search */}
              <div>
                <SkeletonBox className="w-16 h-4 rounded mb-1" />
                <SkeletonBox className="w-full h-8 rounded" />
              </div>
              {/* Filter */}
              <div>
                <SkeletonBox className="w-24 h-4 rounded mb-1" />
                <SkeletonBox className="w-full h-8 rounded" />
              </div>
            </div>
          </SkeletonCard>
        </div>
      </div>

      {/* Results Info Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="w-40 h-6 rounded" />
        <SkeletonBox className="w-32 h-5 rounded" />
      </div>

      {/* Expenses List Skeleton */}
      <SkeletonCard>
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <ExpenseItemSkeleton key={i} />
          ))}
        </div>
      </SkeletonCard>
    </div>
  </div>
)

export default ExpensesSkeleton