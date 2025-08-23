import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, User, Phone, Calendar, ImageIcon } from 'lucide-react'
import { getSite } from '../../services/siteService';
import { Workers } from '../index';
import { Materials } from '../index'
import { getWorkersBySite } from '../../services/workerService'
import { getMaterialsBySite } from '../../services/materialService'
import { setWorkers } from '../../features/workerSlice';
import { setMaterials } from '../../features/materialSlice'
import { useDispatch } from 'react-redux';

const API_URL = "http://localhost:3000";

function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const workerData = await getWorkersBySite(id);
        dispatch(setWorkers(workerData));
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, [id]);
  
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialData = await getMaterialsBySite(id);
        dispatch(setMaterials(materialData));
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    getSite(id)
      .then(site => {
        if (isMounted) {
          console.log(site);
          setSite(site);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Error while fetching site from DB:", err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Format the date if it exists
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error(error);
      return 'Invalid Date';
    }
  };

  // Handle missing image
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading site details...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <p className="text-xl text-gray-600 mb-4">Site not found</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="p-6">
        <button 
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Left Side - Image */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 min-h-[400px] lg:min-h-[600px]">
                {site.siteImage ? (
                  <>
                    <img 
                      src={`${API_URL}/uploads/sites/${site.siteImage}`} 
                      alt={site.siteName || 'Site Image'}
                      className="w-full h-full object-contain bg-gradient-to-br from-blue-500 to-purple-600"
                      onError={handleImageError}
                    />
                    {/* Fallback icon - hidden by default */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 hidden">
                      <ImageIcon className="w-24 h-24 text-white/70" />
                      <div className="absolute bottom-8 left-8 right-8 text-center">
                        <p className="text-white/80 text-lg">No image available</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <ImageIcon className="w-24 h-24 text-white/70 mb-4" />
                    <p className="text-white/80 text-lg">No image available</p>
                  </div>
                )}
              </div>

              {/* Right Side - Details */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                
                {/* Site Name */}
                <div className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {site.siteName || 'Unnamed Site'}
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Location */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">
                      {site.location || 'Not specified'}
                    </p>
                  </div>

                  {/* Created At */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-orange-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Created At</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatDate(site.createdAt)}
                    </p>
                  </div>

                  {/* Manager Name */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Manager Name</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">
                      {site.siteManagerName || 'Not assigned'}
                    </p>
                  </div>

                  {/* Manager Phone */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Phone className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Manager Phone</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">
                      {site.siteManagerContact || 'N/A'}
                    </p>
                  </div>
                  
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Edit Site
                  </button>
                  <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Workers and Materials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            
            {/* Workers List - Bottom Left */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900">Worker List</h2>
                <p className="text-gray-600 mt-1">Manage site workers and assignments</p>
              </div>
              <div className="p-6">
                <Workers siteId={id} />
              </div>
            </div>

            {/* Materials List - Bottom Right */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900">Material List</h2>
                <p className="text-gray-600 mt-1">Track materials and inventory</p>
              </div>
              <div className="p-6">
                <Materials siteId={id} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteDetail