import React from 'react'

const API_URL = "http://localhost:3000";

function DeletedWorker({id, name, mobile, image, deletedAt}) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.log(error);
      return 'Invalid date';
    }
  }

  const handleRestore = () => {
    // TODO: Implement restore logic
    console.log('Restore worker with ID:', id);
  }

  const handlePermanentDelete = () => {
    // TODO: Implement permanent delete logic
    console.log('Permanently delete worker with ID:', id);
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 mb-4 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative grid grid-cols-12 gap-6 p-6 items-center">
        {/* Enhanced Image Section */}
        <div className="col-span-1">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm border-2 border-white ring-1 ring-gray-200 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              {image ? (
                <img 
                  src={`${API_URL}/uploads/workers/${image}`} 
                  alt={name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 to-purple-50" style={{display: image ? 'none' : 'flex'}}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            {/* Deleted indicator */}
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 112 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v3a1 1 0 11-2 0V9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Enhanced Worker Name Section */}
        <div className="col-span-3 flex items-center">
          <div>
            <h3 className="font-semibold text-gray-900 truncate text-lg group-hover:text-blue-700 transition-colors duration-200">
              {name || 'Unnamed Worker'}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                ID: {id}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Section */}
        <div className="col-span-3 flex items-center">
          <div className="flex items-center text-gray-700 bg-gradient-to-r from-gray-50 to-green-50 px-4 py-2 rounded-xl border border-gray-200">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="font-medium truncate">{mobile || 'No mobile'}</span>
          </div>
        </div>

        {/* Enhanced Deleted At Section */}
        <div className="col-span-3 flex items-center">
          <div className="flex items-center text-gray-700 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-2 rounded-xl border border-red-200">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-red-600 font-medium uppercase tracking-wide">Deleted</div>
              <div className="text-sm font-semibold">{formatDate(deletedAt)}</div>
            </div>
          </div>
        </div>

        {/* Enhanced Actions Section */}
        <div className="col-span-2 flex items-center justify-end space-x-4">
          {/* Restore Button */}
          <button
            onClick={handleRestore}
            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110 focus:outline-none"
            title="Restore worker"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Permanent Delete Button */}
          <button
            onClick={handlePermanentDelete}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110 focus:outline-none"
            title="Delete permanently"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletedWorker