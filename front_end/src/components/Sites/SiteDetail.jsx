import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, User, Phone, Calendar, ImageIcon, UserCheck } from 'lucide-react'
import { getSite } from '../../services/siteService';
import { Workers, Memos } from '../index';
import { getWorkersBySite } from '../../services/workerService'
import { setWorkers } from '../../features/workerSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';
import { Link } from 'react-router-dom';
const API_URL = "http://localhost:3000";

function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const managers = useSelector(state => state.manager.managers)
  const [manager, setManager] = useState(null)

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
  }, [id, dispatch]);

  useEffect(() => {
    getAllManager()
      .then(managers => {
        dispatch(setManagers(managers))
      })
      .catch((err) => {
        console.error("Error while fetching managers", err);
      })
  }, [dispatch])

  useEffect(() => {
    let isMounted = true;
    getSite(id)
      .then(site => {
        if (isMounted) {
          console.log(site);
          setSite(site);
          const manager = managers.find((m) => m._id === site.manager)
          console.log(manager);

          setManager(manager)

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
  }, [dispatch, id, managers]);

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

  // Handle missing manager image
  const handleManagerImageError = (e) => {
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

          {/* Top Row - Combined Site & Manager Details and Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Combined Site & Manager Details Card - Top Left */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

              {/* Site Image with Manager Image Overlay */}
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 h-56">
                {site.siteImage ? (
                  <>
                    <img
                      src={`${API_URL}/uploads/sites/${site.siteImage}`}
                      alt={site.siteName || 'Site Image'}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    {/* Fallback icon - hidden by default */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 hidden">
                      <ImageIcon className="w-16 h-16 text-white/70 mb-2" />
                      <p className="text-white/80 text-sm">No image available</p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <ImageIcon className="w-16 h-16 text-white/70 mb-2" />
                    <p className="text-white/80 text-sm">No image available</p>
                  </div>
                )}

                {/* Manager Image Overlay - Top Left Corner */}
                <div className="absolute top-4 left-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {manager && manager.managerImage ? (
                    <>
                      <img
                        src={`${API_URL}/uploads/managers/${manager.managerImage}`}
                        alt={manager.managerName || 'Manager Image'}
                        className="w-full h-full object-cover"
                        onError={handleManagerImageError}
                      />
                      {/* Fallback icon - hidden by default */}
                      <div className="absolute inset-0 flex items-center justify-center bg-emerald-500 hidden">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-500">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Combined Site & Manager Info */}
              <div className="p-6">

                {/* Site Name */}
                <div className="mb-6">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {site.siteName || 'Unnamed Site'}
                  </h1>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </div>

                {/* Site Details - Top Row */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Location */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {site.location || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">Created</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {formatDate(site.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manager Section Divider */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    Site Manager
                  </h3>

                  {manager ? (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Manager Name */}
                      <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {manager.managerName || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {/* Manager Mobile */}
                      <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 mb-1">Mobile</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {manager.managerMobile || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {/* Manager DOB */}
                      <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 mb-1">DOB</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {formatDate(manager.managerDob)}
                          </p>
                        </div>
                      </div>

                      {/* Manager Gender */}
                      <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 mb-1">Gender</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {manager.managerGender || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No manager assigned to this site</p>
                    </div>
                  )}
                </div>

                {/* Site Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm">
                    Edit Site
                  </button>
                  <button className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm">
                    Delete
                  </button>
                </div>

              </div>
            </div>

            {/* Expenses List - Top Right */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <Link
                to={`/site/${id}/expenses`}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-center block"
              >
                Expenses
              </Link>
            </div>

          </div>

          {/* Bottom Section - Workers and Future Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Workers List - Bottom Left */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
             <Link
                to={`/site/${id}/workers`}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-center block"
              >
                Workers
              </Link>  
            </div>

            {/* Notes Section - Bottom Right (Empty for future use) */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900">Notes & Reminders</h2>
                <p className="text-gray-600 mt-1">Site notes and observations</p>
              </div>
              <div className="p-6">
                <Memos siteId={id} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteDetail