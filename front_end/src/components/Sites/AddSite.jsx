import React, { useState } from 'react'
import { addSite } from '../../services/siteService';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { addNewSite } from '../../features/siteSlice';
import { toast } from 'react-toastify';
function AddSite() {
  const [form, setForm] = useState({
    type: '',
    siteName: '',
    location: '',
    siteImage: '',
    managerId: ''   // 🔑 only managerId now
  })
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get managers from Redux
  const managers = useSelector((state) => state.manager.managers);
  console.log(managers);
  

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("type", "site");
      formData.append("siteName", form.siteName);
      formData.append("location", form.location);
      formData.append("managerId", form.managerId); // ✅ sending managerId only
      if (form.siteImage) formData.append("siteImage", form.siteImage);

      const newSite = await addSite(formData);
      dispatch(addNewSite(newSite));
      navigate('/');
      toast.success("✅ New site added successfully!");
    } catch (error) {
      console.error("error while adding new site", error);
      toast.error("❌ Failed to add site!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Site</h2>
          <p className="text-gray-600">Fill in the details to add a new construction site</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Name */}
          <div className="space-y-2">
            <label htmlFor="siteName" className="block text-sm font-semibold text-gray-700">
              Site Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={form.siteName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter site name"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
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
                className={`relative w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
                  <img src={imagePreview} alt="Site preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
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
              Select Manager <span className="text-red-500">*</span>
            </label>
            <select
              id="managerId"
              name="managerId"
              value={form.managerId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Manager --</option>
              {managers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.managerName} ({m.username})
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-lg transition"
          >
            Add Site
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddSite
