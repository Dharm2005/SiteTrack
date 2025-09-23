import React from 'react'

function DeletedMemo({id, text, type, deletedAt}) {
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
    console.log('Restore memo with ID:', id);
  }

  const handlePermanentDelete = () => {
    // TODO: Implement permanent delete logic
    console.log('Permanently delete memo with ID:', id);
  }

  const getMemoTypeIcon = (memoType) => {
    switch(memoType?.toLowerCase()) {
      case 'reminder':
        return (
          <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
      case 'note':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2v8h12V6H4z" clipRule="evenodd" />
          </svg>
        );
    }
  }

  const getMemoTypeColor = (memoType) => {
    switch(memoType?.toLowerCase()) {
      case 'reminder':
        return 'from-orange-50 to-orange-100 border-orange-200 bg-orange-100';
      case 'note':
        return 'from-blue-50 to-blue-100 border-blue-200 bg-blue-100';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200 bg-gray-100';
    }
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 mb-4 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative grid grid-cols-12 gap-4 p-4 items-center">
        {/* Enhanced Memo Text Section */}
        <div className="col-span-5 flex items-center">
          <div className="w-full">
            <p className="text-gray-900 text-sm leading-relaxed line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
              {text || 'No memo text'}
            </p>
          </div>
        </div>

        {/* Enhanced Memo Type Section */}
        <div className="col-span-3 flex items-center">
          <div className={`flex items-center text-gray-700 bg-gradient-to-r ${getMemoTypeColor(type)} px-3 py-2 rounded-xl border`}>
            <div className={`w-6 h-6 ${getMemoTypeColor(type)} rounded-lg flex items-center justify-center mr-2`}>
              {getMemoTypeIcon(type)}
            </div>
            <span className="font-semibold text-sm capitalize">{type || 'Note'}</span>
          </div>
        </div>

        {/* Enhanced Deleted At Section */}
        <div className="col-span-2 flex items-center">
          <div className="flex items-center text-gray-700 bg-gradient-to-r from-red-50 to-orange-50 px-3 py-2 rounded-xl border border-red-200">
            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs font-semibold">{formatDate(deletedAt)}</div>
          </div>
        </div>

        {/* Enhanced Actions Section */}
        <div className="col-span-2 flex items-center justify-end space-x-3">
          {/* Restore Button */}
          <button
            onClick={handleRestore}
            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110 focus:outline-none"
            title="Restore memo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Permanent Delete Button */}
          <button
            onClick={handlePermanentDelete}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110 focus:outline-none"
            title="Delete permanently"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletedMemo