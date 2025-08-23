import React from 'react'
import { Package, Calendar, DollarSign, User, ChevronDown, ChevronUp, Edit3, Trash2, MoreVertical, Truck, Hash, Scale, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const API_URL = "http://localhost:3000";

function Material({ id, name, billImage, quantity, unit, costPerUnit, totalCost, purchasedDate, sellerName, vahicleNumber, createdAt }) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Compact Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Material Basic Info */}
          <div className="flex items-center space-x-3 flex-1">
            {/* Material Image/Icon */}
            <div className="relative flex-shrink-0">
              {billImage ? (
                <div className="relative group">
                  <img 
                    src={`${API_URL}/uploads/bills/${billImage}`} 
                    alt={`${name} bill`}
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
                alt={`${name} bill - Full size`}
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
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-gray-300">Bill/Receipt - Purchased on {formatDate(purchasedDate)}</p>
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

export default Material