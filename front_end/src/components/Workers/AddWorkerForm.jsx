import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addWorker, updateWorkerToDB } from '../../services/workerService'
import { toast } from 'react-toastify';
import { addNewWorker, updateWorker } from '../../features/workerSlice';
import { User, Phone, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://localhost:3000";


function AddWorkerForm({ siteId, onClose, initialValues }) {
  console.log(siteId);

  const [form, setForm] = useState(initialValues || {
    type: 'worker',
    workerName: '',
    workerImage: null,
    workerMobile: '',
    site: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

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

  useEffect(() => {
    if (initialValues) {
      setForm({
        type: 'worker',
        workerName: initialValues.workerName || '',
        workerImage: null,
        workerMobile: initialValues.workerMobile || '',
        site: ''
      })
    }

    if (initialValues && initialValues.workerImage) {
      const imageUrl = `${API_URL}/uploads/workers/${initialValues.workerImage}`
      setImagePreview(imageUrl)
    }

  }, [initialValues])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", "worker");
      formData.append("workerName", form.workerName.trim());
      if (form.workerImage instanceof File) {
        formData.append("workerImage", form.workerImage);
      }
      formData.append("workerMobile", form.workerMobile);
      if (!initialValues && siteId) {
        formData.append("site", siteId);
      }

      let res;

      if (initialValues) {
        formData.append("_id", initialValues._id)
        res = await updateWorkerToDB(initialValues._id, formData)
      } else {
        res = await addWorker(formData);
      }
      if (res.errors) {
        console.log("Validation errors:", res.errors);
        res.errors.forEach(err => {
          toast.error(`${err.field}: ${err.msg}`); 
        });
        return; 
      }

      const workerData = res.worker;
      if (initialValues) {
        dispatch(updateWorker(workerData))
        toast.success("✅ Worker edited successfully!");
        navigate(`/site/${siteId}/workers`)
      } else {
        dispatch(addNewWorker(workerData));
        toast.success("✅ New worker added successfully!");
      }
      // Reset form
      setForm({
        type: 'worker',
        workerName: '',
        workerImage: null,
        workerMobile: '',
        site: ''
      });
      setImagePreview(null);

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
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {initialValues ? "Edit Worker" : "Add New Worker"}
            </h3>
            <p className="text-sm text-gray-600">
              {initialValues ? "Update worker details" : "Fill in the worker details"}
            </p>
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
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
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
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
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
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isSubmitting ? initialValues ? 'Editing Worker...' : 'Adding Worker...' : initialValues ? 'Edit Worker' : 'Add Worker'}
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