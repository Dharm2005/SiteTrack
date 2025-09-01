import React from 'react'
import { Phone, User, Edit3, Trash2, MoreVertical } from 'lucide-react'
import { useState } from 'react'

const API_URL = "http://localhost:3000";

function Worker({id, name, image, mobile}) {
  const [showActions, setShowActions] = useState(false);

  // Format mobile number
  const formatMobile = (mobile) => {
    if (!mobile) return 'No mobile';
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return mobile;
  };

  // Handle missing image
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleEdit = () => {
    console.log('Edit worker:', id);
    setShowActions(false);
  };

  const handleDelete = () => {
    console.log('Delete worker:', id);
    setShowActions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group relative">
      {/* Actions Menu - Top Right */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-md transition-all duration-200"
        >
          <MoreVertical className="w-3 h-3 text-gray-500" />
        </button>

        {showActions && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowActions(false)}
            ></div>
            
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[100px] z-20">
              <button
                onClick={handleEdit}
                className="w-full px-2 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center space-x-1"
              >
                <Trash2 className="w-2.5 h-2.5" />
                <span>Delete</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 text-center">
        {/* Worker Image */}
        <div className="flex justify-center mb-3">
          {image ? (
            <>
              <img 
                src={`${API_URL}/uploads/workers/${image}`} 
                alt={name || 'Worker'}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                onError={handleImageError}
              />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hidden">
                <User className="w-6 h-6 text-white" />
              </div>
            </>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Worker Name */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 truncate">
          {name || 'Unnamed Worker'}
        </h3>

        {/* Mobile Number */}
        <p className="text-xs text-gray-600 truncate">
          {formatMobile(mobile)}
        </p>
      </div>
    </div>
  )
}

export default Worker