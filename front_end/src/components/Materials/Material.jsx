import React from 'react'
import { Package, Calendar, DollarSign, User, ChevronDown, ChevronUp, Edit3, Trash2, MoreVertical, Truck, Hash, Scale } from 'lucide-react'
import { useState } from 'react'

const API_URL = "http://localhost:3000";

function Material({ id, name, quantity, unit, costPerUnit, totalCost, purchasedDate, sellerName, vahicleNumber, createdAt }) {
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

  // Format quantity with unit
  const formatQuantity = (qty, unit) => {
    if (!qty && qty !== 0) return 'N/A';
    return `${qty} ${unit || 'units'}`;
  };

  // Handle missing image
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleEdit = () => {
    console.log('Edit material:', id);
    setShowActions(false);
  };

  const handleDelete = () => {
    console.log('Delete material:', id);
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
          {/* Left Section - Material Basic Info */}
          <div className="flex items-center space-x-3 flex-1">
            {/* Material Icon/Image */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Material Name and Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {name || 'Unnamed Material'}
              </h3>
              <div className="flex items-center space-x-4 text-gray-500 text-sm">
                <div className="flex items-center">
                  <Hash className="w-3 h-3 mr-1" />
                  <span>{formatQuantity(quantity, unit)}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  <span>{formatCurrency(totalCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Purchase Date and Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Purchase Date */}
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Purchased</div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(purchasedDate)}
              </div>
            </div>

            {/* Vehicle Number Badge */}
            {vahicleNumber && (
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium hidden md:block">
                {vahicleNumber}
              </div>
            )}

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

        {/* Mobile-only quick info */}
        <div className="mt-2 sm:hidden">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Purchased: {formatDate(purchasedDate)}</span>
            {vahicleNumber && (
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                {vahicleNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details - Conditionally Visible */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-4 space-y-4">
            {/* Material Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Cost Per Unit */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 bg-blue-100 rounded">
                    <DollarSign className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Cost Per Unit
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {costPerUnit > 0 ? `${formatCurrency(costPerUnit)}/${unit || 'unit'}` : 'Not specified'}
                </p>
              </div>

              {/* Seller Name */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 bg-purple-100 rounded">
                    <User className="w-3 h-3 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Seller
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {sellerName || 'N/A'}
                </p>
              </div>

              {/* Unit */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 bg-green-100 rounded">
                    <Scale className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Unit
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {unit || 'Other'}
                </p>
              </div>
            </div>

            {/* Additional Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Vehicle Number */}
              {vahicleNumber && (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="p-1 bg-yellow-100 rounded">
                      <Truck className="w-3 h-3 text-yellow-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Vehicle Number
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {vahicleNumber}
                  </p>
                </div>
              )}

              {/* Added Date */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 bg-gray-100 rounded">
                    <Calendar className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Added On
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(createdAt)}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Material ID: #{id}
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors font-medium">
                  View Bill
                </button>
                <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors font-medium">
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Material