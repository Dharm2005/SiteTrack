import React, { useState } from 'react'
import {
  Package, Calendar, IndianRupee, Truck, Hash,
  RotateCcw, Trash2, Tag, Clock, Image as ImageIcon, X, User, FileText, Gem
} from 'lucide-react'

const API_URL = "http://localhost:3000";

function DeletedExpense({ 
  id, 
  expenseType, 
  stoneType, 
  billImage, 
  quantity, 
  unit, 
  totalCost, 
  arrivalDate, 
  vehicleNumber, 
  supplierName, 
  details, 
  deletedAt,
  onRestore,
  onPermanentDelete 
}) {
  
  const [selectedImage, setSelectedImage] = useState(null);

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
    if ((!qty && qty !== 0) || !unit) return 'N/A';
    return `${qty} ${unit}`;
  };

  // Format expense type for display
  const formatExpenseType = (type) => {
    if (!type) return 'Other';
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };

  // Get expense type color
  const getExpenseTypeColor = (type) => {
    const colors = {
      cement: 'bg-stone-100 text-stone-700 border-stone-200',
      soil: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      petrol: 'bg-red-100 text-red-700 border-red-200',
      diesel: 'bg-orange-100 text-orange-700 border-orange-200',
      iron: 'bg-gray-100 text-gray-700 border-gray-200',
      vehicleBorrow: 'bg-blue-100 text-blue-700 border-blue-200',
      other: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[type] || colors.other;
  };

  // Handle missing image
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  // Check if quantity/unit should be displayed
  const shouldShowQuantity = !['vehicleBorrow', 'other'].includes(expenseType);

  // Format stone types for display
  const formatStoneTypes = (types) => {
    if (!types || !Array.isArray(types) || types.length === 0) return 'N/A';
    return types.join(', ');
  };

  // Truncate text for better display
  const truncateText = (text, maxLength) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group relative">
        
        {/* Deleted Badge */}
        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
          DELETED
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Left Section: Image + Type + ID */}
            <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
              {/* Expense Image/Icon */}
              <div className="relative flex-shrink-0">
                {billImage ? (
                  <div className="relative group/image cursor-pointer" onClick={() => setSelectedImage(`${API_URL}/uploads/bills/${billImage}`)}>
                    <img
                      src={`${API_URL}/uploads/bills/${billImage}`}
                      alt={`${expenseType} bill`}
                      className="w-10 h-10 rounded-lg object-cover border-2 border-gray-100 shadow-sm"
                      onError={handleImageError}
                    />
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm hidden">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-0 group-hover/image:opacity-100 transition-opacity">
                      <ImageIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Type and ID */}
              <div className="min-w-0">
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getExpenseTypeColor(expenseType)} mb-1`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {formatExpenseType(expenseType)}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">
                    #{id?.slice(-6) || 'N/A'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Deleted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Details Grid */}
            <div className="flex-1 grid grid-cols-5 gap-3 min-w-0">
              
              {/* Stone Type */}
              <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center justify-center text-amber-600 mb-1">
                  <Gem className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">Stone</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {stoneType && Array.isArray(stoneType) && stoneType.length > 0 ? (
                    stoneType.map((type, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200"
                      >
                        {type}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-semibold text-amber-700">N/A</span>
                  )}
                </div>
              </div>

              {/* Supplier */}
              <div className="text-center p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-center text-indigo-600 mb-1">
                  <User className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">Supplier</span>
                </div>
                <div className="text-xs font-semibold text-indigo-700" title={supplierName || 'N/A'}>
                  {truncateText(supplierName, 12)}
                </div>
              </div>

              {/* Quantity */}
              <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-center text-gray-500 mb-1">
                  <Hash className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">Quantity</span>
                </div>
                <div className="text-xs font-bold text-gray-900">
                  {shouldShowQuantity ? formatQuantity(quantity, unit) : 'N/A'}
                </div>
              </div>

              {/* Details */}
              <div className="text-center p-2 bg-teal-50 rounded-lg border border-teal-100 group/details relative">
                <div className="flex items-center justify-center text-teal-600 mb-1">
                  <FileText className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">Details</span>
                </div>
                <div className="text-xs font-semibold text-teal-700 cursor-help">
                  {truncateText(details, 12)}
                </div>
                
                {/* Tooltip for full details */}
                {details && details.length > 12 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/details:opacity-100 transition-opacity duration-300 pointer-events-none z-50 max-w-sm whitespace-normal">
                    <div className="break-words">{details}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>

              {/* Total Cost */}
              <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-center text-green-600 mb-1">
                  <IndianRupee className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">Total</span>
                </div>
                <div className="text-sm font-bold text-green-700">
                  {formatCurrency(totalCost)}
                </div>
              </div>
            </div>

            {/* Right Section: Dates, Vehicle & Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              
              {/* Dates */}
              <div className="space-y-1">
                <div className="p-1.5 bg-blue-50 rounded text-center min-w-[80px]">
                  <div className="flex items-center justify-center text-blue-600 mb-0.5">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="text-xs font-medium">Arrival</span>
                  </div>
                  <div className="text-xs font-semibold text-blue-700">
                    {formatDate(arrivalDate)}
                  </div>
                </div>

                <div className="p-1.5 bg-red-50 rounded text-center min-w-[80px]">
                  <div className="flex items-center justify-center text-red-600 mb-0.5">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="text-xs font-medium">Deleted</span>
                  </div>
                  <div className="text-xs font-semibold text-red-700">
                    {formatDate(deletedAt)}
                  </div>
                </div>
              </div>

              {/* Vehicle & Actions */}
              <div className="text-center">
                {vehicleNumber ? (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs font-semibold mb-2 min-w-[90px]">
                    <div className="flex items-center justify-center">
                      <Truck className="w-3 h-3 mr-1" />
                      <span>{vehicleNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 text-gray-500 px-3 py-2 rounded-lg text-xs mb-2 min-w-[90px]">
                    <div className="flex items-center justify-center">
                      <Truck className="w-3 h-3 mr-1" />
                      <span>No Vehicle</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-1">
                  <button
                    onClick={onRestore}
                    className="p-1.5 rounded-md transition-all duration-200 border text-green-600 bg-green-50 hover:bg-green-100 hover:scale-105 border-green-200"
                    title="Restore expense"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onPermanentDelete}
                    className="p-1.5 rounded-md transition-all duration-200 border text-red-600 bg-red-50 hover:bg-red-100 hover:scale-105 border-red-200"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Mobile View */}
          <div className="block lg:hidden mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-amber-50 rounded border border-amber-100">
                <span className="text-amber-600 font-medium">Stone: </span>
                <span className="text-amber-700 font-semibold">{formatStoneTypes(stoneType)}</span>
              </div>
              <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                <span className="text-indigo-600 font-medium">Supplier: </span>
                <span className="text-indigo-700 font-semibold">{supplierName || 'N/A'}</span>
              </div>
              {details && (
                <div className="col-span-2 p-2 bg-teal-50 rounded border border-teal-100">
                  <span className="text-teal-600 font-medium">Details: </span>
                  <span className="text-teal-700 font-semibold">{details}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Full Bill"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default DeletedExpense