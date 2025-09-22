import React from 'react'
import { useEffect } from 'react'
import { getDeletedWorkers } from '../../services/recycleService'
import { useState } from 'react'
import DeletedWorker from './DeletedWorker'

function DeletedWorkers({siteId}) {
  const [deletedWorkers, setDeletedWorkers] = useState(null)

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const deletedWorkersData = await getDeletedWorkers(siteId);
        console.log(deletedWorkersData);
        setDeletedWorkers(deletedWorkersData)
      } catch (error) {
        console.error("Error while fetching deleted workers", error);
        setDeletedWorkers([]); // Set empty array on error
      }
    }
    fetchWorkers()
  }, [siteId])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {deletedWorkers && deletedWorkers.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Updated Header with perfect alignment */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
              <div className="col-span-1 flex items-center pl-5">
                <span className="font-semibold text-gray-700 text-sm">Image</span>
              </div>
              <div className="col-span-3 flex items-center pl-6">
                <span className="font-semibold text-gray-700 text-sm">Worker Name</span>
              </div>
              <div className="col-span-3 flex items-center pl-13">
                <span className="font-semibold text-gray-700 text-sm">Mobile</span>
              </div>
              <div className="col-span-3 flex items-center pl-20">
                <span className="font-semibold text-gray-700 text-sm">Deleted At</span>
              </div>
              <div className="col-span-2 flex items-center justify-center pl-14">
                <span className="font-semibold text-gray-700 text-sm">Actions</span>
              </div>
            </div>
            
            {/* Data rows */}
            <div>
              {deletedWorkers.map(worker => (
                <DeletedWorker
                  key={worker._id}
                  id={worker._id}
                  name={worker.workerName}
                  image={worker.workerImage}
                  mobile={worker.workerMobile}
                  deletedAt={worker.deletedAt}
                />
              ))}
            </div>
          </div>
        ) : deletedWorkers && deletedWorkers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted workers</h3>
            <p className="text-gray-500">Your recycle bin is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading deleted workers...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeletedWorkers