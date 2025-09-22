import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, User, Phone, Calendar, ImageIcon, UserCheck, Users, IndianRupee, FileText, Edit, Trash2, X, Download } from 'lucide-react'
import { getSite } from '../../services/siteService';
import { Memos } from '../index';
import { getWorkersBySite } from '../../services/workerService'
import { setWorkers } from '../../features/workerSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAllManager } from '../../services/managerService';
import { setManagers } from '../../features/managerSlice';
import { ReportForm } from '../index';
import { Link } from 'react-router-dom';
import { Loader } from '../index';
const API_URL = "http://localhost:3000";

function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const managers = useSelector(state => state.manager.managers)
  const [manager, setManager] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const { user } = useSelector((state) => state.auth);

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

  // Handle site image click
  const handleSiteImageClick = () => {
    setSelectedImage(`${API_URL}/uploads/sites/${site.siteImage}`);
  };

  // Handle manager image click with event stopping
  const handleManagerImageClick = (e) => {
    e.stopPropagation(); // Prevent the site image click from firing
    setSelectedImage(`${API_URL}/uploads/managers/${manager.managerImage}`);
  };

  // Handle generate report button click
  const handleGenerateReport = () => {
    setShowReportForm(true);
  };

  // Handle close report form
  const handleCloseReportForm = () => {
    setShowReportForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full -mt-12">
        <Loader message={"Loading site details..."} />
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
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="p-6 flex items-center justify-between">
    {/* Back Button */}
    <button
      onClick={handleBack}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">Back</span>
    </button>

    {/* Recycle Bin Button - Only show for managers */}
    {user.role === 'manager' && (
      <Link
        to={`/site/${id}/recycle-bin`}
        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-slate-100 to-gray-100 hover:from-slate-200 hover:to-gray-200 text-slate-700 hover:text-slate-800 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] group"
      >
        {/* Recycle Icon */}
        <svg 
          className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        <span className="text-sm font-medium">Recycle Bin</span>
      </Link>
    )}
  </div>


        {/* Main Content */}
        <div className="px-6 pb-6 max-w-7xl mx-auto">

          {/* Top Section - Site Details and Navigation Cards Side by Side */}
          <div className="grid lg:grid-cols-5 gap-6 mb-6">

            {/* Left Side - Site and Manager Details */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">

                {/* Better Site Header */}
                <div
                  className="relative bg-gradient-to-br from-blue-500 to-purple-600 h-40 cursor-pointer"
                  onClick={handleSiteImageClick}
                >
                  {site.siteImage ? (
                    <>
                      <img
                        src={`${API_URL}/uploads/sites/${site.siteImage}`}
                        alt={site.siteName || 'Site Image'}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 hidden">
                        <ImageIcon className="w-12 h-12 text-white/70 mb-1" />
                        <p className="text-white/80 text-xs">No image available</p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <ImageIcon className="w-12 h-12 text-white/70 mb-1" />
                      <p className="text-white/80 text-xs">No image available</p>
                    </div>
                  )}

                  {/* Site Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h1 className="text-2xl font-bold text-white">
                      {site.siteName || 'Unnamed Site'}
                    </h1>
                  </div>

                  {/* Manager Image in Top Right Corner */}
                  {manager && (
                    <div
                      className="absolute top-3 right-3 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                      onClick={handleManagerImageClick}
                    >
                      {manager.managerImage ? (
                        <>
                          <img
                            src={`${API_URL}/uploads/managers/${manager.managerImage}`}
                            alt={manager.managerName || 'Manager Image'}
                            className="w-full h-full object-cover"
                            onError={handleManagerImageError}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500 hidden">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Site and Manager Details */}
                <div className="p-5 flex-1">
                  <div className="grid md:grid-cols-2 gap-6">

                    {/* Site Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                        Site Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">Location</span>
                          <span className="font-medium text-gray-900">{site.location || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">Created</span>
                          <span className="font-medium text-gray-900">{formatDate(site.createdAt)}</span>
                        </div>

                        {/* Generate Report Button */}

                        <div className="pt-3 border-t border-gray-100">
                          <button
                            onClick={handleGenerateReport}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <Download className="w-5 h-5" />
                            <span>Generate Report</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Manager Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <UserCheck className="w-4 h-4 text-emerald-600 mr-2" />
                        Site Manager
                      </h3>
                      {manager ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm py-1">
                            <span className="text-gray-600">Name</span>
                            <span className="font-medium text-gray-900">{manager.managerName || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span className="text-gray-600">Mobile</span>
                            <span className="font-medium text-gray-900">{manager.managerMobile || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span className="text-gray-600">Gender</span>
                            <span className="font-medium text-gray-900">{manager.managerGender || 'Not specified'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <User className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-gray-500 text-sm">No manager assigned</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Navigation Cards */}
            <div className="lg:col-span-2 flex flex-col space-y-4 h-full">

              {/* Workers Card */}
              <Link
                to={`/site/${id}/workers`}
                className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Workers</h3>
                      <p className="text-blue-100">Manage site workers and their details</p>
                    </div>
                    <Users className="w-12 h-12 text-blue-200 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="p-6 bg-blue-50">
                  <div className="flex items-center justify-between text-blue-800">
                    <span className="font-medium">View all workers</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Expenses Card */}
              <Link
                to={`/site/${id}/expenses`}
                className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
              >
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Expenses</h3>
                      <p className="text-emerald-100">Track and manage site expenses</p>
                    </div>
                    <IndianRupee className="w-12 h-12 text-emerald-200 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="p-6 bg-emerald-50">
                  <div className="flex items-center justify-between text-emerald-800">
                    <span className="font-medium">View all expenses</span>
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Pdf Form */}
          {showReportForm && (
            <ReportForm siteId={id} onClose={handleCloseReportForm} />
          )}

          {/* Notes & Reminders - Full Width */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Notes & Reminders
                  </h2>
                  <p className="text-purple-100 text-sm">Site notes and observations</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Memos siteId={id} />
            </div>
          </div>

        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Full site"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}

    </>
  );
}

export default SiteDetail