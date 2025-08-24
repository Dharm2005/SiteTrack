import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addManager } from '../../services/managerService';
import { addNewManager } from '../../features/managerSlice';

function AddManager() {
  const [form, setForm] = useState({
    type: '',
    managerName: '',
    managerImage: '',
    managerMobile: '',
    managerDob: '',
    managerGender: ''
  })
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if(e.target.name !== 'managerImage') {
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
        setForm({...form, managerImage: file});
        
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
    setForm({...form, managerImage: ''});
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('managerImage');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("type","manager");
      formData.append("managerName",form.managerName);
      formData.append("managerImage",form.managerImage);
      formData.append("managerMobile",form.managerMobile);
      formData.append("managerDob",form.managerDob);
      formData.append("managerGender",form.managerGender);
  
      const newManager = await addManager(formData);
      dispatch(addNewManager(newManager))
      navigate('/managers')
      toast.success("✅ New manager added successfully!");
    } catch (error) {
      console.error("error while adding new manager", error);
      navigate('/managers')
      toast.error("❌ Error while adding manager!");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Manager</h2>
          <p className="text-gray-600">Fill in the details to add a new site manager</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="managerName" className="block text-sm font-semibold text-gray-700">
              Manager Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="managerName"
              name="managerName"
              value={form.managerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
              placeholder="Enter manager's full name"
            />
          </div>

          {/* Enhanced Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Manager Photo
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
                  id="managerImage"
                  name="managerImage"
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
                    alt="Manager preview" 
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
                  {form.managerImage?.name || 'Image uploaded successfully'}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="managerMobile" className="block text-sm font-semibold text-gray-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="managerMobile"
              name="managerMobile"
              value={form.managerMobile}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
              placeholder="Enter mobile number"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="managerDob" className="block text-sm font-semibold text-gray-700">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="managerDob"
              name="managerDob"
              value={form.managerDob}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="managerGender"
                  value="male"
                  checked={form.managerGender === 'male'}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="managerGender"
                  value="female"
                  checked={form.managerGender === 'female'}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Female</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] shadow-lg"
          >
            Add Manager
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddManager