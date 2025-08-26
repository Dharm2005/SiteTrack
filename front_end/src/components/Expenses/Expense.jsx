import React, { useState } from 'react'
import {
  Package, Calendar, DollarSign, Truck, Hash, Scale,
  Edit3, Trash2, Tag, Clock, Image as ImageIcon, X
} from 'lucide-react'

const API_URL = "http://localhost:3000";

function Expense({ id, expenseType, billImage, quantity, unit, totalCost, arrivalDate, vehicleNumber, createdAt }) {
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

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error(error);
      return 'Invalid Date';
    }
  };

  // Calculate days ago
  const getDaysAgo = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch (error) {
      console.error(error);
      return '';
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

  const handleEdit = () => {
    console.log('Edit expense:', id);
  };

  const handleDelete = () => {
    console.log('Delete expense:', id);
  };

  // Check if quantity/unit should be displayed
  const shouldShowQuantity = !['vehicleBorrow', 'other'].includes(expenseType);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6 items-center">

            {/* Column 1: Image/Icon + Expense Type (4 cols) */}
            <div className="col-span-12 sm:col-span-4 flex items-center space-x-4">
              {/* Expense Image/Icon */}
              <div className="relative flex-shrink-0">
                {billImage ? (
                  <div className="relative group/image cursor-pointer" onClick={() => setSelectedImage(`${API_URL}/uploads/bills/${billImage}`)}>
                    <img
                      src={`${API_URL}/uploads/bills/${billImage}`}
                      alt={`${expenseType} bill`}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 shadow-sm"
                      onError={handleImageError}
                    />
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm hidden">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>

              {/* Expense Type & Details */}
              <div className="flex-1 min-w-0">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getExpenseTypeColor(expenseType)} mb-2`}>
                  <Tag className="w-3.5 h-3.5 mr-2" />
                  {formatExpenseType(expenseType)}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                    #{id?.slice(-6) || 'N/A'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{getDaysAgo(createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Quantity & Unit (2 cols) */}
            <div className="col-span-6 sm:col-span-2">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center text-gray-500 mb-1">
                  <Hash className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium uppercase tracking-wide">Quantity</span>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {shouldShowQuantity ? formatQuantity(quantity, unit) : 'N/A'}
                </div>
              </div>
            </div>

            {/* Column 3: Total Cost (2 cols) */}
            <div className="col-span-6 sm:col-span-2">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center text-green-600 mb-1">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium uppercase tracking-wide">Total Cost</span>
                </div>
                <div className="text-sm font-bold text-green-700">
                  {formatCurrency(totalCost)}
                </div>
              </div>
            </div>

            {/* Column 4: Dates (2 cols) */}
            <div className="col-span-6 sm:col-span-2">
              <div className="space-y-2">
                {/* Arrival Date */}
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-600 mb-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="text-xs font-medium">Arrival</span>
                  </div>
                  <div className="text-xs font-semibold text-blue-700">
                    {formatDate(arrivalDate)}
                  </div>
                </div>

                {/* Created Date */}
                <div className="p-2 bg-purple-50 rounded-lg">
                  <div className="flex items-center text-purple-600 mb-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="text-xs font-medium">Added</span>
                  </div>
                  <div className="text-xs font-semibold text-purple-700">
                    {formatDate(createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 5: Vehicle & Actions (2 cols) */}
            <div className="col-span-6 sm:col-span-2">
              <div className="flex flex-col space-y-3">
                {/* Vehicle Number */}
                {vehicleNumber ? (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs font-semibold text-center">
                    <div className="flex items-center justify-center">
                      <Truck className="w-3 h-3 mr-1.5" />
                      <span>{vehicleNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 text-gray-500 px-3 py-2 rounded-lg text-xs text-center">
                    <div className="flex items-center justify-center">
                      <Truck className="w-3 h-3 mr-1.5" />
                      <span>No Vehicle</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Centered under vehicle */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Edit Button */}
                  <button
                    onClick={handleEdit}
                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110 border border-blue-200"
                    title="Edit expense"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110 border border-red-200"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Additional Info Row */}
          <div className="mt-6 sm:hidden border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-500 mb-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">Created</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatDateTime(createdAt)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-500 mb-1">
                  <Scale className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">Unit</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 capitalize">
                  {unit || 'N/A'}
                </div>
              </div>
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

export default Expense