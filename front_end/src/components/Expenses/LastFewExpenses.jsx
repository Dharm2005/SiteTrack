import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLastFewExpenses } from '../../services/expenseService';
import { ChevronDown, ChevronUp, Calendar, DollarSign, Truck, Image as ImageIcon, Package, Hash, Scale, X, ZoomIn } from 'lucide-react';

const API_URL = "http://localhost:3000";

function LastFewExpenses({ id }) {
  const [expenses, setExpenses] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getLastFewExpenses(id);
        setExpenses(response)
      } catch (err) {
        console.error("Error while fetching last few details", err);
      }
    }
    fetchExpenses();
  }, [id])

  const toggleRow = (expenseId) => {
    setExpandedRows(prev => ({
      ...prev,
      [expenseId]: !prev[expenseId]
    }));
  };

  const openImageModal = (billImage) => {
    setSelectedImage(billImage);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getExpenseTypeIcon = (type) => {
    switch(type) {
      case 'petrol':
      case 'diesel':
        return '⛽';
      case 'cement':
        return '🏗️';
      case 'iron':
        return '🔩';
      case 'soil':
        return '🌱';
      case 'vehicleBorrow':
        return '🚛';
      default:
        return '📦';
    }
  };

  const getExpenseTypeColor = (type) => {
    switch(type) {
      case 'petrol':
      case 'diesel':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'cement':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'iron':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'soil':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'vehicleBorrow':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">No recent expenses found</p>
        <Link
          to={`/site/${id}/expenses`}
          className="inline-flex bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          View All Expenses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 text-blue-600 mr-2" />
          Recent Expenses
        </h3>
        <p className="text-sm text-gray-500">Last {expenses.length} expense(s)</p>
      </div>

      {/* Expenses List */}
      <div className="divide-y divide-gray-100">
        {expenses.map((expense) => (
          <div key={expense._id} className="p-4">
            {/* Main Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                {/* Bill Image Thumbnail */}
                {expense.billImage ? (
                  <div className="relative group">
                    <div 
                      onClick={() => openImageModal(expense.billImage)}
                      className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors group-hover:shadow-md"
                    >
                      <img
                        src={`${API_URL}/uploads/bills/${expense.billImage}`}
                        alt="Bill thumbnail"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center" style={{display: 'none'}}>
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-2.5 h-2.5" />
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                  </div>
                )}

                {/* Expense Type Badge */}
                <div className={`px-2.5 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getExpenseTypeColor(expense.expenseType)}`}>
                  <span>{getExpenseTypeIcon(expense.expenseType)}</span>
                  <span className="capitalize">{expense.expenseType}</span>
                </div>

                {/* Quantity Display */}
                {expense.quantity > 0 && (
                  <div className="flex items-center text-sm text-gray-700 bg-blue-50 px-2 py-1 rounded">
                    <Hash className="w-3 h-3 mr-1 text-blue-600" />
                    <span>{expense.quantity} {expense.unit}</span>
                  </div>
                )}

                {/* Vehicle Number */}
                {expense.vehicleNumber && (
                  <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    <Truck className="w-3 h-3 mr-1" />
                    <span>{expense.vehicleNumber}</span>
                  </div>
                )}
              </div>

              {/* Cost & Expand Button */}
              <div className="flex items-center space-x-2 ml-3">
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">₹{expense.totalCost}</div>
                  <div className="text-xs text-gray-500">{formatDate(expense.arrivalDate)}</div>
                </div>
                
                <button
                  onClick={() => toggleRow(expense._id)}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {expandedRows[expense._id] ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRows[expense._id] && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Arrival:</span>
                      <span className="ml-2 font-medium">{formatDate(expense.arrivalDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="ml-2 font-medium text-green-600">₹{expense.totalCost}</span>
                    </div>

                    {expense.quantity > 0 && (
                      <div className="flex items-center text-sm">
                        <Scale className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Quantity:</span>
                        <span className="ml-2 font-medium">{expense.quantity} {expense.unit}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    {expense.vehicleNumber && (
                      <div className="flex items-center text-sm">
                        <Truck className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="ml-2 font-medium">{expense.vehicleNumber}</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium capitalize">{expense.expenseType}</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Added:</span>
                      <span className="ml-2 text-gray-500">{formatDate(expense.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Bill Image Display */}
                {expense.billImage && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Bill/Receipt
                      </span>
                      <button 
                        onClick={() => openImageModal(expense.billImage)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline flex items-center space-x-1"
                      >
                        <ZoomIn className="w-3 h-3" />
                        <span>View Full Image</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer with View Details Button */}
      <div className="px-4 py-3 border-t bg-gray-50">
        <Link
          to={`/site/${id}/expenses`}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-center block"
        >
          View All Expenses
        </Link>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={`${API_URL}/uploads/bills/${selectedImage}`}
              alt="Bill full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={closeImageModal}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LastFewExpenses