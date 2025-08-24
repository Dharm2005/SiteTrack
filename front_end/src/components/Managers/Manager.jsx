import React from 'react'

const API_URL = "http://localhost:3000";

function Manager({ name, image, mobile, dob, gender, username, createdAt }) {
  // Format date of birth
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate age from DOB
  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header with overlapping large profile image */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-20">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
            {image ? (
              <img 
                src={`${API_URL}/uploads/managers/${image}`} 
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-6 px-6">
        {/* Name and Username */}
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
          {username && (
            <p className="text-sm text-gray-500">@{username}</p>
          )}
        </div>

        {/* Manager Details */}
        <div className="space-y-3">
          {/* Mobile */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mobile</p>
              <p className="text-sm font-medium text-gray-900">{mobile}</p>
            </div>
          </div>

          {/* Age and Gender */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Age & Gender</p>
              <p className="text-sm font-medium text-gray-900">
                {calculateAge(dob)} years, {gender}
              </p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(dob)}</p>
            </div>
          </div>

          {/* Joined Date */}
          {createdAt && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(createdAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-6">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            View Details
          </button>
          <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Manager