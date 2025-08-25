import React from 'react'
import { Package, Calendar, DollarSign, Truck, Hash, Scale, Edit3, Trash2, MoreVertical, X, ZoomIn, ZoomOut, RotateCcw, Tag } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const API_URL = "http://localhost:3000";

function Expense({ id, expenseType, billImage, quantity, unit, totalCost, arrivalDate, vehicleNumber, createdAt }) {
  const [showActions, setShowActions] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

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
      cement: 'bg-stone-100 text-stone-700',
      soil: 'bg-yellow-100 text-yellow-700',
      petrol: 'bg-red-100 text-red-700',
      diesel: 'bg-orange-100 text-orange-700',
      iron: 'bg-gray-100 text-gray-700',
      vehicleBorrow: 'bg-blue-100 text-blue-700',
      other: 'bg-purple-100 text-purple-700'
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
    setShowActions(false);
  };

  const handleDelete = () => {
    console.log('Delete expense:', id);
    setShowActions(false);
  };

  const openImageModal = () => {
    setShowImageModal(true);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5)); // Max zoom 5x
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev / 1.5, 0.5); // Min zoom 0.5x
      if (newZoom <= 1) {
        setPosition({ x: 0, y: 0 }); // Reset position when zooming out to fit
      }
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Add event listeners for mouse events
  useEffect(() => {
    if (showImageModal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [showImageModal, isDragging, dragStart, zoom]);

  // Add keyboard support for ESC key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && showImageModal) {
        closeImageModal();
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [showImageModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showImageModal]);

  // Check if quantity/unit should be displayed
  const shouldShowQuantity = !['vehicleBorrow', 'other'].includes(expenseType);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Single Row Layout */}
      <div className="p-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          
          {/* Column 1: Image/Icon + Expense Type (3 cols) */}
          <div className="col-span-12 sm:col-span-3 flex items-center space-x-3">
            {/* Expense Image/Icon */}
            <div className="relative flex-shrink-0">
              {billImage ? (
                <div className="relative group">
                  <img 
                    src={`${API_URL}/uploads/bills/${billImage}`} 
                    alt={`${expenseType} bill`}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-gray-100 cursor-pointer hover:border-green-300 transition-colors"
                    onError={handleImageError}
                    onClick={openImageModal}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                  {/* Fallback icon - hidden by default, shown on image error */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center hidden">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Expense Type */}
            <div className="flex-1 min-w-0">
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getExpenseTypeColor(expenseType)}`}>
                <Tag className="w-3 h-3 mr-1.5" />
                {formatExpenseType(expenseType)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ID: #{id?.slice(-6) || 'N/A'}
              </div>
            </div>
          </div>

          {/* Column 2: Quantity & Unit (2 cols) */}
          <div className="col-span-6 sm:col-span-2">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-500 mb-1">
                <Hash className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium uppercase tracking-wide">Quantity</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {shouldShowQuantity ? formatQuantity(quantity, unit) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Column 3: Total Cost (2 cols) */}
          <div className="col-span-6 sm:col-span-2">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-500 mb-1">
                <DollarSign className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium uppercase tracking-wide">Total Cost</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(totalCost)}
              </div>
            </div>
          </div>

          {/* Column 4: Arrival Date (2 cols) */}
          <div className="col-span-6 sm:col-span-2">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-500 mb-1">
                <Calendar className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium uppercase tracking-wide">Arrival</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatDate(arrivalDate)}
              </div>
            </div>
          </div>

          {/* Column 5: Vehicle Number + Actions (1 col) */}
          <div className="col-span-6 sm:col-span-1">
            <div className="flex flex-col items-center space-y-2">
              {/* Vehicle Number */}
              {vehicleNumber ? (
                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium text-center">
                  <div className="flex items-center">
                    <Truck className="w-3 h-3 mr-1" />
                    <span>{vehicleNumber}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 text-center">
                  <Truck className="w-3 h-3 mx-auto mb-1" />
                  No Vehicle
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
                    
                    <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-20">
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
            </div>
          </div>
        </div>

        {/* Mobile Additional Info Row */}
        <div className="mt-3 sm:hidden border-t border-gray-100 pt-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">Added:</span>
              <span className="ml-1 font-medium">{formatDate(createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-500">Unit:</span>
              <span className="ml-1 font-medium capitalize">{unit || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && billImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && closeImageModal()}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 5}
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleResetZoom}
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200 rounded-full p-2"
                title="Reset Zoom"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              {/* Zoom Level Indicator */}
              <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded text-center">
                {Math.round(zoom * 100)}%
              </div>
            </div>

            {/* Image Container */}
            <div 
              ref={containerRef}
              className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
              onWheel={handleWheel}
            >
              <img
                ref={imageRef}
                src={`${API_URL}/uploads/bills/${billImage}`}
                alt={`${expenseType} bill - Full size`}
                className="absolute top-1/2 left-1/2 max-w-none transition-transform duration-200 ease-out select-none"
                style={{
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                onMouseDown={handleMouseDown}
                onLoad={() => {
                  // Ensure image fits initially
                  if (imageRef.current && containerRef.current) {
                    const img = imageRef.current;
                    const container = containerRef.current;
                    const imgAspect = img.naturalWidth / img.naturalHeight;
                    const containerAspect = container.clientWidth / container.clientHeight;
                    
                    if (imgAspect > containerAspect) {
                      img.style.width = '90vw';
                      img.style.height = 'auto';
                    } else {
                      img.style.height = '90vh';
                      img.style.width = 'auto';
                    }
                  }
                }}
                draggable={false}
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black via-black to-transparent text-white p-4 rounded-lg bg-opacity-60">
              <h3 className="text-lg font-semibold">{formatExpenseType(expenseType)}</h3>
              <p className="text-sm text-gray-300">Bill/Receipt - Arrival: {formatDate(arrivalDate)}</p>
              <p className="text-xs text-gray-400 mt-1">
                Use mouse wheel to zoom • Click and drag to pan when zoomed • ESC to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Expense