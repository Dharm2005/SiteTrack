import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addWorker } from  '../../services/workerService'
import {toast} from 'react-toastify';
import { addNewWorker } from '../../features/workerSlice';
import { User, Phone, DollarSign, Upload, X } from 'lucide-react';

function AddWorkerForm({siteId, onClose}) {
  const [form, setForm] = useState({
    type: 'worker',
    workerName: '',
    workerImage: null,
    workerMobile: '',
    workerAdvance: 0,
    workerPerDiem: 0,
    sites: []
  })

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Worker Name validation
    if (!form.workerName.trim()) {
      newErrors.workerName = 'Worker name is required';
    } else if (form.workerName.trim().length < 2) {
      newErrors.workerName = 'Worker name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(form.workerName.trim())) {
      newErrors.workerName = 'Worker name should only contain letters and spaces';
    }

    // Advance validation
    if (form.workerAdvance < 0) {
      newErrors.workerAdvance = 'Advance amount cannot be negative';
    }

    // Per diem validation
    if (form.workerPerDiem < 0) {
      newErrors.workerPerDiem = 'Per diem amount cannot be negative';
    }

    // Image validation
    if (form.workerImage) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(form.workerImage.type)) {
        newErrors.workerImage = 'Please upload a valid image file (JPEG, PNG, WebP)';
      } else if (form.workerImage.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.workerImage = 'Image size should be less than 5MB';
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
      } else if (name === 'workerName') {
        // Remove extra spaces and capitalize first letter of each word
        processedValue = value.replace(/\s+/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      } else if (name === 'workerMobile') {
        // Remove non-digit characters
        processedValue = value.replace(/\D/g, '').slice(0, 10);
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
      formData.append("type", "worker");
      formData.append("workerName", form.workerName.trim());
      if (form.workerImage) {
        formData.append("workerImage", form.workerImage);
      }
      formData.append("workerMobile", form.workerMobile);
      formData.append("workerAdvance", form.workerAdvance);
      formData.append("workerPerDiem", form.workerPerDiem);
      formData.append("sites", JSON.stringify([siteId]));

      const newWorker = await addWorker(formData);
      console.log(newWorker);
      
      dispatch(addNewWorker(newWorker));
      toast.success("✅ New worker added successfully!");
      
      // Reset form
      setForm({
        type: 'worker',
        workerName: '',
        workerImage: null,
        workerMobile: '',
        workerAdvance: 0,
        workerPerDiem: 0,
        sites: []
      });
      setImagePreview(null);
      setErrors({});
      
      if (onClose) onClose();
    } catch (error) {
      console.error("error while adding new worker", error);
      toast.error("❌ Failed to add worker. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, workerImage: null });
    setImagePreview(null);
    if (errors.workerImage) {
      setErrors(prev => ({ ...prev, workerImage: '' }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Worker</h3>
            <p className="text-sm text-gray-600">Fill in the worker details</p>
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
        {/* Worker Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Worker Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="workerName"
              value={form.workerName}
              onChange={handleChange}
              placeholder="Enter worker's full name"
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.workerName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.workerName && (
            <p className="text-red-500 text-sm mt-1">{errors.workerName}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="workerMobile"
              value={form.workerMobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Advance and Per Diem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Advance Amount (₹)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="workerAdvance"
                value={form.workerAdvance}
                onChange={handleChange}
                min="0"
                step="50"
                placeholder="0"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.workerAdvance ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.workerAdvance && (
              <p className="text-red-500 text-sm mt-1">{errors.workerAdvance}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Per Diem (₹/day)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="workerPerDiem"
                value={form.workerPerDiem}
                onChange={handleChange}
                min="0"
                step="50"
                placeholder="0"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.workerPerDiem ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.workerPerDiem && (
              <p className="text-red-500 text-sm mt-1">{errors.workerPerDiem}</p>
            )}
          </div>
        </div>

        {/* Worker Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Worker Photo
          </label>
          
          {!imagePreview ? (
            <div className="relative">
              <input
                type="file"
                name="workerImage"
                onChange={handleChange}
                accept="image/*"
                className="hidden"
                id="workerImageInput"
              />
              <label
                htmlFor="workerImageInput"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                  errors.workerImage ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload worker photo</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Worker preview"
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
          
          {errors.workerImage && (
            <p className="text-red-500 text-sm mt-1">{errors.workerImage}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isSubmitting ? 'Adding Worker...' : 'Add Worker'}
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

export default AddWorkerForm