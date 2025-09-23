import React, { useEffect, useState } from 'react'
import { getDeletedMemos } from '../../services/recycleService';
import DeletedMemo from './DeletedMemo';

function DeletedMemos({siteId}) {
  const [deletedMemos, setDeletedMemos] = useState(null)
  
  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const deletedMemosData = await getDeletedMemos(siteId);
        console.log(deletedMemosData);
        setDeletedMemos(deletedMemosData)
      } catch (error) {
        console.error("Error while fetching deleted memos", error);
        setDeletedMemos([]); // Set empty array on error
      }
    }
    fetchMemos()
  }, [siteId])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {deletedMemos && deletedMemos.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header with perfect alignment */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
              <div className="col-span-5 flex items-center pl-2">
                <span className="font-semibold text-gray-700 text-sm">Memo Text</span>
              </div>
              <div className="col-span-3 flex items-center pl-2">
                <span className="font-semibold text-gray-700 text-sm">Memo Type</span>
              </div>
              <div className="col-span-2 flex items-center pl-2">
                <span className="font-semibold text-gray-700 text-sm">Deleted At</span>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <span className="font-semibold text-gray-700 text-sm">Actions</span>
              </div>
            </div>
            
            {/* Data rows */}
            <div>
              {deletedMemos.map(memo => (
                <DeletedMemo
                  key={memo._id}
                  id={memo._id}
                  text={memo.text}
                  type={memo.memoType}
                  deletedAt={memo.deletedAt}
                />
              ))}
            </div>
          </div>
        ) : deletedMemos && deletedMemos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted memos</h3>
            <p className="text-gray-500">Your recycle bin is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading deleted memos...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeletedMemos