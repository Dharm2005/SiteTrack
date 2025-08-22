import React from 'react';
import { MapPin, User, Phone, Calendar, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = "http://localhost:3000";

function Site({ id ,name, location, image, managerName, managerContact, createdAt }) {
  // Format the date if it exists
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error(error);
      return 'Invalid Date';
    }
  };

  // Handle missing image
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-105">
      {/* Large Image Section */}
      <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {image ? (
          <>
            <img 
              src={`${API_URL}/uploads/sites/${image}`} 
              alt={name || 'Site Image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
            />
            {/* Fallback icon - hidden by default */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 hidden">
              <ImageIcon className="w-20 h-20 text-white/70" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <ImageIcon className="w-20 h-20 text-white/70" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
        
        {/* Site name overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-white text-2xl font-bold truncate drop-shadow-lg">
            {name || 'Unnamed Site'}
          </h3>
        </div>
      </div>

      {/* Compact Details Section */}
      <div className="p-6">
        {/* Two Column Layout for Details */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Location */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-500">Location</span>
              </div>
              <p className="text-gray-900 font-medium truncate">
                {location || 'Not specified'}
              </p>
            </div>

            {/* Manager Name */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-500">Manager</span>
              </div>
              <p className="text-gray-900 font-medium truncate">
                {managerName || 'Not assigned'}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Contact */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Phone className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-500">Contact</span>
              </div>
              <p className="text-gray-900 font-medium truncate">
                {managerContact || 'N/A'}
              </p>
            </div>

            {/* Created Date */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-500">Created</span>
              </div>
              <p className="text-gray-900 font-medium">
                {formatDate(createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <Link 
            to={`/site/${id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
          >
            View Details
          </Link>
          <Link 
            to=""
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-center"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Site;