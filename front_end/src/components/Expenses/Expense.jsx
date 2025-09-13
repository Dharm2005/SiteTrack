import React, { useState } from 'react'
import {
  Package, Calendar,IndianRupee, Truck, Hash, Scale,
  Edit3, Trash2, Tag, Clock, Image as ImageIcon, X, User, FileText, Gem, Loader2
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpenseFromDB } from '../../services/expenseService';
import { deleteExpense } from '../../features/expenseSlice';
import { Link } from 'react-router-dom';

const API_URL = "http://localhost:3000";

function Expense({ id, expenseType, stoneType, billImage, quantity, unit, totalCost, arrivalDate, vehicleNumber, supplierName, details, createdAt, searchTerm }) {

  const {user} = useSelector(state => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const dispatch = useDispatch()

  // Highlight text function
  const highlightText = (text, searchTerm) => {
    if (!text || !searchTerm || typeof text !== 'string') return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <span
            key={index}
            className="bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded-sm font-semibold animate-pulse"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

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

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you really want to delete this expense?");

    if(confirmed){
      setIsDeleting(true);
      setIsAnimatingOut(true);
      
      try {
        // Add a small delay to show the animation
        await new Promise(resolve => setTimeout(resolve, 300));
        await deleteExpenseFromDB(id);
        
        // Wait for fade animation to complete before removing from store
        setTimeout(() => {
          dispatch(deleteExpense(id));
        }, 400);
      } catch (error) {
        console.error("Error while deleting expense", error);
        // Reset states on error
        setIsDeleting(false);
        setIsAnimatingOut(false);
      }
    }
  };

  // Check if quantity/unit should be displayed
  const shouldShowQuantity = !['vehicleBorrow', 'other'].includes(expenseType);

  // Format stone types for display
  const formatStoneTypes = (types) => {
    if (!types || !Array.isArray(types) || types.length === 0) return 'N/A';
    return types.join(', ');
  };

  // Truncate text for better display
  

  // Create highlighted truncated text
  const getHighlightedTruncatedText = (text, maxLength, searchTerm) => {
    if (!text) return 'N/A';
    
    // If there's a search term and it matches, don't truncate to show the match
    if (searchTerm && text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return highlightText(text, searchTerm);
    }
    
    const truncated = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    return highlightText(truncated, searchTerm);
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-500 border border-gray-100 group relative overflow-visible ${
        isAnimatingOut 
          ? 'opacity-0 scale-95 transform translate-y-4' 
          : 'opacity-100 scale-100 transform translate-y-0'
      } ${isDeleting ? 'pointer-events-none' : ''}`}
           style={{ zIndex: isDeleting ? '10' : 'var(--hover-z-index, 1)' }}
           onMouseEnter={(e) => {
             if (!isDeleting) {
               e.currentTarget.style.setProperty('--hover-z-index', '10');
             }
           }}
           onMouseLeave={(e) => {
             if (!isDeleting) {
               e.currentTarget.style.setProperty('--hover-z-index', '1');
             }
           }}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* Left Section: Image + Type + ID */}
            <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
              {/* Expense Image/Icon */}
              <div className="relative flex-shrink-0">
                {billImage ? (
                  <div className="relative group/image cursor-pointer" onClick={() => !isDeleting && setSelectedImage(`${API_URL}/uploads/bills/${billImage}`)}>
                    <img
                      src={`${API_URL}/uploads/bills/${billImage}`}
                      alt={`${expenseType} bill`}
                      className="w-10 h-10 rounded-lg object-cover border-2 border-gray-100 shadow-sm"
                      onError={handleImageError}
                    />
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm hidden">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    {!isDeleting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-0 group-hover/image:opacity-100 transition-opacity">
                        <ImageIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
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
                  {highlightText(formatExpenseType(expenseType), searchTerm)}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">
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
                        {highlightText(type, searchTerm)}
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
                  {getHighlightedTruncatedText(supplierName, 12, searchTerm)}
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
                  {getHighlightedTruncatedText(details, 12, searchTerm)}
                </div>
                
                {/* Tooltip for full details */}
                {details && details.length > 12 && !isDeleting && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/details:opacity-100 transition-opacity duration-300 pointer-events-none z-50 max-w-sm whitespace-normal">
                    <div className="break-words">{highlightText(details, searchTerm)}</div>
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

                <div className="p-1.5 bg-purple-50 rounded text-center min-w-[80px]">
                  <div className="flex items-center justify-center text-purple-600 mb-0.5">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="text-xs font-medium">Added</span>
                  </div>
                  <div className="text-xs font-semibold text-purple-700">
                    {formatDate(createdAt)}
                  </div>
                </div>
              </div>

              {/* Vehicle */}
              <div className="text-center">
                {vehicleNumber ? (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-xs font-semibold mb-2 min-w-[90px]">
                    <div className="flex items-center justify-center">
                      <Truck className="w-3 h-3 mr-1" />
                      <span>{highlightText(vehicleNumber, searchTerm)}</span>
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

                {user.role === 'manager' ? (
                  <>
                  {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-1">
                  <Link
                    to={`/edit-expense/${id}`}
                    disabled={isDeleting}
                    className={`p-1.5 rounded-md transition-all duration-200 border ${
                      isDeleting 
                        ? 'opacity-50 cursor-not-allowed text-blue-400 bg-blue-25 border-blue-100' 
                        : 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:scale-105 border-blue-200'
                    }`}
                    title="Edit expense"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`p-1.5 rounded-md transition-all duration-200 border flex items-center justify-center ${
                      isDeleting 
                        ? 'bg-red-100 border-red-200 cursor-not-allowed' 
                        : 'text-red-600 bg-red-50 hover:bg-red-100 hover:scale-105 border-red-200'
                    }`}
                    title="Delete expense"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 text-red-600 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                  </>
                ) : (<></>)}
              </div>
            </div>

          </div>

          {/* Mobile View - Show as cards when screen is too small */}
          <div className={`block lg:hidden mt-3 pt-3 border-t border-gray-100 ${isDeleting ? 'opacity-50' : ''}`}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-amber-50 rounded border border-amber-100">
                <span className="text-amber-600 font-medium">Stone: </span>
                <span className="text-amber-700 font-semibold">{highlightText(formatStoneTypes(stoneType), searchTerm)}</span>
              </div>
              <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                <span className="text-indigo-600 font-medium">Supplier: </span>
                <span className="text-indigo-700 font-semibold">{highlightText(supplierName || 'N/A', searchTerm)}</span>
              </div>
              {details && (
                <div className="col-span-2 p-2 bg-teal-50 rounded border border-teal-100">
                  <span className="text-teal-600 font-medium">Details: </span>
                  <span className="text-teal-700 font-semibold">{highlightText(details, searchTerm)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deleting Overlay - Covers entire expense */}
        {isDeleting && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center rounded-lg z-20">
            <div className="bg-red-50 rounded-full p-4 mb-3">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
            <span className="text-sm text-red-600 font-medium">Deleting expense...</span>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && !isDeleting && (
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