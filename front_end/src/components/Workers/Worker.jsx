import React from 'react'
import { Phone, Calendar, DollarSign, User, MoreVertical, Edit3, Trash2 } from 'lucide-react'
import { useState } from 'react'

const API_URL = "http://localhost:3000";

function Worker({ id, name, image, mobile, advance, perDiem, createdAt }) {
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
    // Format as +91 XXXXX XXXXX
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
    // Add edit functionality here
  };

  const handleDelete = () => {
    console.log('Delete worker:', id);
    setShowActions(false);
    // Add delete functionality here
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Header with Image and Name */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Worker Image */}
            <div className="relative">
              {image ? (
                <>
                  <img 
                    src={`${API_URL}/uploads/workers/${image}`} 
                    alt={name || 'Worker'}
                    className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                    onError={handleImageError}
                  />
                  {/* Fallback icon - hidden by default */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hidden">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* Worker Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {name || 'Unnamed Worker'}
              </h3>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">Joined {formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showActions && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowActions(false)}
                ></div>
                
                {/* Menu */}
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-20">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Worker Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Mobile Number */}
          <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Mobile
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatMobile(mobile)}
            </p>
          </div>

          {/* Advance Amount */}
          <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <DollarSign className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Advance
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(advance)}
            </p>
          </div>

          {/* Per Diem */}
          <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Per Diem
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(perDiem)}/day
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors font-medium">
              View Details
            </button>
            <button className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors font-medium">
              Mark Present
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Worker