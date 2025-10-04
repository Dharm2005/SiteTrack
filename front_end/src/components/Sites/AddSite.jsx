import React, { useState } from 'react'
import { addSite } from '../../services/siteService';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { addNewSite } from '../../features/siteSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { updateSite } from '../../features/siteSlice';
import { updateSiteToDB } from '../../services/siteService';
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';

const API_URL = "http://localhost:3000";


function AddSite({ initialValues }) {
  const [form, setForm] = useState(initialValues || {
    type: '',
    siteName: '',
    location: '',
    siteImage: '',
    managerId: ''
  })
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get managers from Redux
  const managers = useSelector((state) => state.manager.managers);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        if (!managers || managers.length === 0) {
          const managerData = await getAllManager();
          dispatch(setManagers(managerData));
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchManagers();
  }, [dispatch, managers]);

  const handleChange = (e) => {
    if (e.target.name !== 'siteImage') {
      setForm({ ...form, [e.target.name]: e.target.value })
    } else {
      const file = e.target.files[0];
      setForm({ ...form, siteImage: file })

      // preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setForm({ ...form, siteImage: file });

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload only image files (JPG, JPEG, PNG)");
      }
    }
  };

  const removeImage = () => {
    setForm({ ...form, siteImage: '' });
    setImagePreview(null);
    const fileInput = document.getElementById('siteImage');
    if (fileInput) fileInput.value = '';
  };

  useEffect(() => {
    if (initialValues) {
      setForm({
        type: 'site',
        siteName: initialValues.siteName || '',
        location: initialValues.location || '',
        siteImage: null,
        managerId: initialValues.manager?._id?.toString() || initialValues.manager?.toString() || ''
      });

      if (initialValues.siteImage) {
        const imageUrl = `${API_URL}/uploads/sites/${initialValues.siteImage}`
        setImagePreview(imageUrl);
      }
    }
  }, [initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("type", "site");
      formData.append("siteName", form.siteName);
      formData.append("location", form.location);
      formData.append("managerId", form.managerId);

      if (form.siteImage instanceof File) {
        formData.append("siteImage", form.siteImage);
      }

      let res;
      
      if (initialValues) {
        // update
        formData.append("_id", initialValues._id);
        res = await updateSiteToDB(initialValues._id, formData);
      } else {
        // add new
        res = await addSite(formData);
      }

      // 🟢 Handle validation errors
      if (res.success === false) {
        if (res.errors && (res.errors.length > 0)) {
          res.errors.forEach(err => {
            toast.error(`${err.msg}`);
          });
        } else if (res.message) {
          toast.error(res.message || " Something went wrong");
          navigate('/')
        }
        return;
      }

      // 🟢 Success case
      const siteData = res.site; // backend sends { message, site }
      if (initialValues) {

        dispatch(updateSite(siteData));
        toast.success("✅ Site updated successfully!");
      } else {
        dispatch(addNewSite(siteData));
        toast.success("✅ New site added successfully!");
      }

      navigate("/");
    } catch (error) {
      console.error("Unexpected error while submitting site", error);
      toast.error("❌ Something went wrong!");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {initialValues ? 'Edit Site' : 'Add New Site'}
          </h2>
          <p className="text-gray-600">
            {initialValues ? 'Update the site details' : 'Fill in the details to add a new construction site'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Name */}
          <div className="space-y-2">
            <label htmlFor="siteName" className="block text-sm font-semibold text-gray-700">
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={form.siteName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter site name"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter site location"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Site Image
            </label>
            {!imagePreview ? (
              <div
                className={`relative w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="siteImage"
                  name="siteImage"
                  accept="image/jpg,image/jpeg,image/png"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Site preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', imagePreview);
                      // Fallback: try without /uploads/sites/ prefix
                      if (imagePreview.includes('/uploads/sites/')) {
                        e.target.src = imagePreview.replace('/uploads/sites/', '/');
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Manager Select */}
          <div className="space-y-2">
            <label htmlFor="managerId" className="block text-sm font-semibold text-gray-700">
              Select Manager
            </label>
            <select
              id="managerId"
              name="managerId"
              value={form.managerId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Manager --</option>
              {managers.map((m) => (


                <option key={m._id} value={m._id.toString()}>
                  {m.managerName} ({m.userId.username})
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-lg transition-colors"
          >
            {initialValues ? 'Update Site' : 'Add Site'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddSite