import React from 'react'

const API_URL = "http://localhost:3000";

function DeletedSite({id, name, location, image, deletedAt}) {
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
    console.log('Restore site with ID:', id);
  }

  const handlePermanentDelete = () => {
    // TODO: Implement permanent delete logic
    console.log('Permanently delete site with ID:', id);
  }

  return (
    <div className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors duration-150">
      {/* Image */}
      <div className="col-span-1">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          {image ? (
            <img 
              src={`${API_URL}/uploads/sites/${image}`} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-full h-full flex items-center justify-center text-gray-400" style={{display: image ? 'none' : 'flex'}}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Site Name */}
      <div className="col-span-3 flex items-center">
        <div>
          <h3 className="font-medium text-gray-900 truncate">{name || 'Unnamed Site'}</h3>
          <p className="text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>

      {/* Location */}
      <div className="col-span-3 flex items-center">
        <div className="flex items-center text-gray-700">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location || 'No location'}</span>
        </div>
      </div>

      {/* Deleted At */}
      <div className="col-span-3 flex items-center">
        <div className="flex items-center text-gray-700">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{formatDate(deletedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-center space-x-2">
        {/* Restore Button */}
        <button
          onClick={handleRestore}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-150 group"
          title="Restore site"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Permanent Delete Button */}
        <button
          onClick={handlePermanentDelete}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150 group"
          title="Delete permanently"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default DeletedSite