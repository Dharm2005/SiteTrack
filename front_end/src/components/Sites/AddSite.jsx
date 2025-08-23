import React, { useState } from 'react'
import { addSite } from '../../services/siteService';
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addNewSite } from '../../features/siteSlice';
import {toast} from 'react-toastify';

function AddSite() {
  const [form, setForm] = useState({
    type: '',
    siteName: '',
    location: '',
    siteImage: '',
    siteManagerName: '',
    siteManagerContact: ''
  })
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if(e.target.name !== 'siteImage') {
      setForm({...form, [e.target.name]: e.target.value})
    } else {
      const file = e.target.files[0];
      setForm({...form, [e.target.name]: file})
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
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
      
      // Check if it's an image file
      if (file.type.startsWith('image/')) {
        setForm({...form, siteImage: file});
        
        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload only image files (JPG, JPEG, PNG)");
      }
    }
  };

  const removeImage = () => {
    setForm({...form, siteImage: ''});
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('siteImage');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("type","site");
      formData.append("siteName",form.siteName);
      formData.append("location",form.location);
      formData.append("siteImage",form.siteImage);
      formData.append("siteManagerName",form.siteManagerName);
      formData.append("siteManagerContact",form.siteManagerContact);

      const newSite = await addSite(formData);
      dispatch(addNewSite(newSite))
      navigate('/')
      toast.success("✅ New site added successfully!");
    } catch (error) {
      console.error("error while adding new site", error);
      navigate('/')
      toast.success("✅ New site added successfully!");
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
              placeholder="Enter site name"
            />
          </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
              placeholder="Enter site location"
            />
          </div>

          {/* Enhanced Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Site Image
            </label>
            
            {!imagePreview ? (
              <div 
                className={`relative w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
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
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span> or drag and drop
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Site preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {form.siteImage?.name || 'Image uploaded successfully'}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="siteManagerName" className="block text-sm font-semibold text-gray-700">
              Site Manager Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="siteManagerName"
              name="siteManagerName"
              value={form.siteManagerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
              placeholder="Enter manager's name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="siteManagerContact" className="block text-sm font-semibold text-gray-700">
              Site Manager Contact <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="siteManagerContact"
              name="siteManagerContact"
              value={form.siteManagerContact}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] shadow-lg"
          >
            Add Site
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddSite