import React, { useState } from 'react'
import { addSite } from '../../services/siteService';
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addNewSite } from '../../features/siteSlice';
import {toast} from 'react-toastify';

function AddSite() {
  const [form, setForm] = useState({
    siteName: '',
    location: '',
    siteImage: '',
    siteManagerName: '',
    siteManagerContact: ''
  })

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if(e.target.name !== 'siteImage')
      setForm({...form, [e.target.name]: e.target.value})
    else
      setForm({...form, [e.target.name]: e.target.files[0]})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
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
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Add New Site</h2>
      
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="siteImage" className="block text-sm font-semibold text-gray-700">
            Site Image
          </label>
          <input
            type="file"
            id="siteImage"
            name="siteImage"
            accept='image/jpg, image/jpeg, image/png'
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
          />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="siteManagerContact" className="block text-sm font-semibold text-gray-700">
            Site Manager Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="siteManagerContact"
            name="siteManagerContact"
            value={form.siteManagerContact}
            onChange={handleChange}
            placeholder="Phone number"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Site
        </button>
      </form>
    </div>
  )
}

export default AddSite