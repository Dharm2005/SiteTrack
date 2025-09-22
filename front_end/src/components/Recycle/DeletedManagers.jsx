import React, { useState } from 'react'
import { useEffect } from 'react';
import {getDeletedManagers} from '../../services/recycleService'
import DeletedManager from './DeletedManager';

function DeletedManagers() {
  const [deletedManagers, setDeletedManagers] = useState()

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const deletedManagers = await getDeletedManagers();
        console.log(deletedManagers);
        setDeletedManagers(deletedManagers)
      } catch (error) {
        console.error("Error while fetching deleted managers", error);
      }
    }
    fetchManagers()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {deletedManagers && deletedManagers.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header with perfect alignment for managers */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
              <div className="col-span-1 flex items-center pl-5">
                <span className="font-semibold text-gray-700 text-sm">Photo</span>
              </div>
              <div className="col-span-2 flex items-center pl-6">
                <span className="font-semibold text-gray-700 text-sm">Manager Name</span>
              </div>
              <div className="col-span-2 flex items-center pl-16">
                <span className="font-semibold text-gray-700 text-sm">Mobile</span>
              </div>
              <div className="col-span-2 flex items-center pl-10">
                <span className="font-semibold text-gray-700 text-sm">Date of Birth</span>
              </div>
              <div className="col-span-1 flex items-center pl-6">
                <span className="font-semibold text-gray-700 text-sm">Gender</span>
              </div>
              <div className="col-span-2 flex items-center pl-23">
                <span className="font-semibold text-gray-700 text-sm">Deleted At</span>
              </div>
              <div className="col-span-2 flex items-center justify-center pl-14">
                <span className="font-semibold text-gray-700 text-sm">Actions</span>
              </div>
            </div>
            
            {/* Data rows */}
            <div>
              {deletedManagers.map(manager => (
                <DeletedManager
                  key={manager._id}
                  id={manager._id}
                  name={manager.managerName}
                  image={manager.managerImage}
                  mobile={manager.managerMobile}
                  dob={manager.managerDob}
                  gender={manager.managerGender}
                  deletedAt={manager.deletedAt}
                />
              ))}
            </div>
          </div>
        ) : deletedManagers && deletedManagers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted managers</h3>
            <p className="text-gray-500">Your recycle bin is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading deleted managers...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeletedManagers