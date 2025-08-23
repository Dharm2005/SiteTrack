import React from 'react'
import { Phone, Calendar, DollarSign, User, ChevronDown, ChevronUp, Edit3, Trash2, MoreVertical } from 'lucide-react'
import { useState } from 'react'

const API_URL = "http://localhost:3000";

function Worker({ id, name, image, mobile, advance, perDiem, createdAt }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Format the date
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

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format mobile number
  const formatMobile = (mobile) => {
    if (!mobile) return 'N/A';
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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Compact Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Worker Basic Info */}
          <div className="flex items-center space-x-3 flex-1">
            {/* Worker Image */}
            <div className="relative flex-shrink-0">
              {image ? (
                <>
                  <img 
                    src={`${API_URL}/uploads/workers/${image}`} 
                    alt={name || 'Worker'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                    onError={handleImageError}
                  />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hidden">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Worker Name and Date */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {name || 'Unnamed Worker'}
              </h3>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Joined {formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Status Indicator */}
            {/* <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600 hidden sm:block">Active</span>
            </div> */}

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {showActions && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowActions(false)}
                  ></div>
                  
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-20">
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={toggleExpanded}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details - Conditionally Visible */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-4 space-y-4">
            {/* Worker Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Mobile Number */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 bg-green-100 rounded">
                    <Phone className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Mobile
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatMobile(mobile)}
                </p>
              </div>

              {/* Advance Amount */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 bg-orange-100 rounded">
                    <DollarSign className="w-3 h-3 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Advance
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(advance)}
                </p>
              </div>

              {/* Per Diem */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 bg-blue-100 rounded">
                    <DollarSign className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Per Diem
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(perDiem)}/day
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Worker ID: #{id}
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors font-medium">
                  View Profile
                </button>
                {/* <button className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors font-medium">
                  Mark Present
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Worker