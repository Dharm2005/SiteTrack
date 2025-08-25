import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addExpens } from  '../../services/expenseService'
import {toast} from 'react-toastify';
import { addNewExpense } from '../../features/expenseSlice';
import { Package, Upload, X, DollarSign, Calendar, Truck, Hash, Scale, Tag } from 'lucide-react';

function AddExpenseForm({siteId, onClose}) {
  const [form, setForm] = useState({
    expenseType: 'other',
    billImage: null,
    quantity: 0,
    unit: 'other',
    totalCost: 0,
    arrivalDate: '',
    vehicleNumber: '',
    sites: []
  })

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();

  const expenseTypeOptions = [
    { value: "cement", label: "Cement" },
    { value: "soil", label: "Soil" },
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "iron", label: "Iron" },
    { value: "vehicleBorrow", label: "Vehicle Borrow" },
    { value: "other", label: "Other" }
  ];

  const unitOptions = ["kg", "ton", "piece", "bag", "litre", "meter", "other"];

  // Check if unit is required based on expense type
  const isUnitRequired = () => {
    return !['vehicleBorrow', 'other'].includes(form.expenseType);
  };

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Expense Type validation
    if (!form.expenseType) {
      newErrors.expenseType = 'Expense type is required';
    }

    // Quantity validation - only required if unit is required
    if (isUnitRequired() && form.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    // Unit validation - required only for specific expense types
    if (isUnitRequired() && !form.unit) {
      newErrors.unit = 'Unit is required for this expense type';
    }

    // Total cost validation
    if (form.totalCost <= 0) {
      newErrors.totalCost = 'Total cost must be greater than 0';
    }

    // Arrival Date validation
    if (!form.arrivalDate) {
      newErrors.arrivalDate = 'Arrival date is required';
    } else {
      const selectedDate = new Date(form.arrivalDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today
      if (selectedDate > today) {
        newErrors.arrivalDate = 'Arrival date cannot be in the future';
      }
    }

    // Vehicle Number validation (optional but if provided should be valid format)
    if (form.vehicleNumber.trim() && !/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/.test(form.vehicleNumber.trim().replace(/\s/g, '').toUpperCase())) {
      // Basic Indian vehicle number format validation
      if (form.vehicleNumber.trim().length < 4) {
        newErrors.vehicleNumber = 'Vehicle number seems too short';
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
      } else if (name === 'vehicleNumber') {
        // Convert to uppercase and remove extra spaces
        processedValue = value.replace(/\s+/g, ' ').toUpperCase().trim();
      }
      
      setForm({
        ...form,
        [name]: processedValue
      });

      // Reset unit and quantity when expense type changes to vehicleBorrow or other
      if (name === 'expenseType' && ['vehicleBorrow', 'other'].includes(processedValue)) {
        setForm(prev => ({
          ...prev,
          [name]: processedValue,
          unit: 'other',
          quantity: 0
        }));
        // Clear related errors
        setErrors(prev => ({ 
          ...prev, 
          unit: '', 
          quantity: '' 
        }));
      }
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
      formData.append("expenseType", form.expenseType);
      if (form.billImage) {
        formData.append("billImage", form.billImage);
      }
      
      // Only append quantity and unit if they are relevant for the expense type
      if (isUnitRequired()) {
        formData.append("quantity", form.quantity);
        formData.append("unit", form.unit);
      } else {
        // For vehicleBorrow and other, set default values
        formData.append("quantity", 0);
        formData.append("unit", "other");
      }
      
      formData.append("totalCost", form.totalCost);
      formData.append("arrivalDate", form.arrivalDate);
      formData.append("vehicleNumber", form.vehicleNumber.trim());
      formData.append("sites", JSON.stringify([siteId]));

      const newExpense = await addExpens(formData);
      console.log(newExpense);
      
      dispatch(addNewExpense(newExpense));
      toast.success("✅ New expense added successfully!");
      
      // Reset form
      setForm({
        expenseType: 'other',
        billImage: null,
        quantity: 0,
        unit: 'other',
        totalCost: 0,
        arrivalDate: '',
        vehicleNumber: '',
        sites: []
      });
      setImagePreview(null);
      setErrors({});
      
      if (onClose) onClose();
    } catch (error) {
      console.error("error while adding new expense", error);
      toast.error("❌ Failed to add expense. Please try again.");
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
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-green-100 rounded-md">
            <Package className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add New Expense</h3>
            <p className="text-xs text-gray-500">Fill in the expense details</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Row: Expense Type & Total Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Type *
            </label>
            <div className="relative">
              <Tag className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="expenseType"
                value={form.expenseType}
                onChange={handleChange}
                className={`w-full pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                  errors.expenseType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {expenseTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.expenseType && (
              <p className="text-red-500 text-xs mt-1">{errors.expenseType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Cost (₹) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="totalCost"
                value={form.totalCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter total cost"
                className={`w-full pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                  errors.totalCost ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.totalCost && (
              <p className="text-red-500 text-xs mt-1">{errors.totalCost}</p>
            )}
          </div>
        </div>

        {/* Second Row: Quantity & Unit (Conditional) */}
        {isUnitRequired() && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <div className="relative">
                <Hash className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter quantity"
                  className={`w-full pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit *
              </label>
              <div className="relative">
                <Scale className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                    errors.unit ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {unitOptions.map(unit => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.unit && (
                <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
              )}
            </div>
          </div>
        )}

        {/* Third Row: Arrival Date & Vehicle Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="arrivalDate"
                value={form.arrivalDate}
                onChange={handleChange}
                max={getTodayDate()}
                className={`w-full pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                  errors.arrivalDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.arrivalDate && (
              <p className="text-red-500 text-xs mt-1">{errors.arrivalDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number
            </label>
            <div className="relative">
              <Truck className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                placeholder="Enter vehicle number"
                className={`w-full pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${
                  errors.vehicleNumber ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.vehicleNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicleNumber}</p>
            )}
          </div>
        </div>

        {/* Bill Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  errors.billImage ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-sm text-gray-600">Upload bill/receipt</p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Bill preview"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {errors.billImage && (
            <p className="text-red-500 text-xs mt-1">{errors.billImage}</p>
          )}
        </div>

        {/* Info Note for Optional Fields */}
        {!isUnitRequired() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <p className="text-sm text-blue-700">
                For <strong>{expenseTypeOptions.find(opt => opt.value === form.expenseType)?.label}</strong> expenses, 
                quantity and unit fields are optional.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddExpenseForm