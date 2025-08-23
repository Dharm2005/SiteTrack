import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addMaterial } from  '../../services/materialService'
import {toast} from 'react-toastify';
import { addNewMaterial } from '../../features/materialSlice';
import { Package, Upload, X, DollarSign, Calendar, User, Truck, Hash, Scale } from 'lucide-react';

function AddMaterialForm({siteId, onClose}) {
  const [form, setForm] = useState({
    type: 'material',
    materialName: '',
    billImage: null,
    quantity: 0,
    unit: 'other',
    costPerUnit: 0,
    totalCost: 0,
    purchasedDate: '',
    sellerName: '',
    vahicleNumber: '',
    sites: []
  })

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();

  const unitOptions = ["kg", "ton", "piece", "bag", "litre", "meter", "other"];

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Material Name validation
    if (!form.materialName.trim()) {
      newErrors.materialName = 'Material name is required';
    } else if (form.materialName.trim().length < 2) {
      newErrors.materialName = 'Material name must be at least 2 characters';
    }

    // Quantity validation
    if (form.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    // Cost validation - at least one should be provided
    if (form.costPerUnit <= 0 && form.totalCost <= 0) {
      newErrors.costValidation = 'Either cost per unit or total cost must be greater than 0';
    }

    // Cost per unit validation
    if (form.costPerUnit < 0) {
      newErrors.costPerUnit = 'Cost per unit cannot be negative';
    }

    // Total cost validation
    if (form.totalCost < 0) {
      newErrors.totalCost = 'Total cost cannot be negative';
    }

    // Purchased Date validation
    if (!form.purchasedDate) {
      newErrors.purchasedDate = 'Purchase date is required';
    } else {
      const selectedDate = new Date(form.purchasedDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today
      if (selectedDate > today) {
        newErrors.purchasedDate = 'Purchase date cannot be in the future';
      }
    }

    // Seller Name validation
    if (!form.sellerName.trim()) {
      newErrors.sellerName = 'Seller name is required';
    } else if (form.sellerName.trim().length < 2) {
      newErrors.sellerName = 'Seller name must be at least 2 characters';
    }

    // Vehicle Number validation (optional but if provided should be valid format)
    if (form.vahicleNumber.trim() && !/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/.test(form.vahicleNumber.trim().replace(/\s/g, '').toUpperCase())) {
      // Basic Indian vehicle number format validation
      if (form.vahicleNumber.trim().length < 4) {
        newErrors.vahicleNumber = 'Vehicle number seems too short';
      }
    }

    // Image validation
    if (form.billImage) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(form.billImage.type)) {
        newErrors.billImage = 'Please upload a valid image file (JPEG, PNG, WebP)';
      } else if (form.billImage.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.billImage = 'Image size should be less than 5MB';
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Clear existing error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear cost validation error when either cost field changes
    if ((name === 'costPerUnit' || name === 'totalCost') && errors.costValidation) {
      setErrors(prev => ({ ...prev, costValidation: '' }));
    }

    if (files && files.length > 0) {
      const file = files[0];
      setForm({ ...form, [name]: file });
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      let processedValue = value;
      
      // Handle different input types
      if (type === "number") {
        processedValue = value === '' ? 0 : Number(value);
      } else if (name === 'materialName' || name === 'sellerName') {
        // Remove extra spaces and capitalize first letter of each word
        processedValue = value.replace(/\s+/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      } else if (name === 'vahicleNumber') {
        // Convert to uppercase and remove extra spaces
        processedValue = value.replace(/\s+/g, ' ').toUpperCase().trim();
      }
      
      setForm({
        ...form,
        [name]: processedValue
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("type", "material");
      formData.append("materialName", form.materialName.trim());
      if (form.billImage) {
        formData.append("billImage", form.billImage);
      }
      formData.append("quantity", form.quantity);
      formData.append("unit", form.unit);
      formData.append("costPerUnit", form.costPerUnit);
      formData.append("totalCost", form.totalCost);
      formData.append("purchasedDate", form.purchasedDate);
      formData.append("sellerName", form.sellerName.trim());
      formData.append("vahicleNumber", form.vahicleNumber.trim());
      formData.append("sites", JSON.stringify([siteId]));

      const newMaterial = await addMaterial(formData);
      console.log(newMaterial);
      
      dispatch(addNewMaterial(newMaterial));
      toast.success("✅ New material added successfully!");
      
      // Reset form
      setForm({
        type: 'material',
        materialName: '',
        billImage: null,
        quantity: 0,
        unit: 'other',
        costPerUnit: 0,
        totalCost: 0,
        purchasedDate: '',
        sellerName: '',
        vahicleNumber: '',
        sites: []
      });
      setImagePreview(null);
      setErrors({});
      
      if (onClose) onClose();
    } catch (error) {
      console.error("error while adding new material", error);
      toast.error("❌ Failed to add material. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, billImage: null });
    setImagePreview(null);
    if (errors.billImage) {
      setErrors(prev => ({ ...prev, billImage: '' }));
    }
  };

  // Get today's date in YYYY-MM-DD format for max date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Material</h3>
            <p className="text-sm text-gray-600">Fill in the material details</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Material Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Material Name *
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="materialName"
              value={form.materialName}
              onChange={handleChange}
              placeholder="Enter material name"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.materialName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
              }`}
            />
          </div>
          {errors.materialName && (
            <p className="text-red-500 text-sm mt-1">{errors.materialName}</p>
          )}
        </div>

        {/* Quantity and Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter quantity"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.quantity ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                }`}
              />
            </div>
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unit *
            </label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                {unitOptions.map(unit => (
                  <option key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cost Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-700">
              Cost Information *
            </h4>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              At least one cost field is required
            </span>
          </div>
          
          {errors.costValidation && (
            <p className="text-red-500 text-sm">{errors.costValidation}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Cost Per Unit (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="costPerUnit"
                  value={form.costPerUnit}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Cost per unit"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.costPerUnit ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                />
              </div>
              {errors.costPerUnit && (
                <p className="text-red-500 text-sm mt-1">{errors.costPerUnit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Total Cost (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="totalCost"
                  value={form.totalCost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Total cost"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.totalCost ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                />
              </div>
              {errors.totalCost && (
                <p className="text-red-500 text-sm mt-1">{errors.totalCost}</p>
              )}
            </div>
          </div>
        </div>

        {/* Purchase Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Purchase Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              name="purchasedDate"
              value={form.purchasedDate}
              onChange={handleChange}
              max={getTodayDate()}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.purchasedDate ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
              }`}
            />
          </div>
          {errors.purchasedDate && (
            <p className="text-red-500 text-sm mt-1">{errors.purchasedDate}</p>
          )}
        </div>

        {/* Seller Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seller Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="sellerName"
              value={form.sellerName}
              onChange={handleChange}
              placeholder="Enter seller/vendor name"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.sellerName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
              }`}
            />
          </div>
          {errors.sellerName && (
            <p className="text-red-500 text-sm mt-1">{errors.sellerName}</p>
          )}
        </div>

        {/* Vehicle Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vehicle Number
          </label>
          <div className="relative">
            <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="vahicleNumber"
              value={form.vahicleNumber}
              onChange={handleChange}
              placeholder="Enter vehicle number (optional)"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.vahicleNumber ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
              }`}
            />
          </div>
          {errors.vahicleNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.vahicleNumber}</p>
          )}
        </div>

        {/* Bill Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bill/Receipt Photo
          </label>
          
          {!imagePreview ? (
            <div className="relative">
              <input
                type="file"
                name="billImage"
                onChange={handleChange}
                accept="image/*"
                className="hidden"
                id="billImageInput"
              />
              <label
                htmlFor="billImageInput"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                  errors.billImage ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload bill/receipt photo</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Bill preview"
                className="w-32 h-32 object-cover rounded-xl border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {errors.billImage && (
            <p className="text-red-500 text-sm mt-1">{errors.billImage}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isSubmitting ? 'Adding Material...' : 'Add Material'}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddMaterialForm