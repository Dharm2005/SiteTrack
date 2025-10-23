import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, User, Phone, Calendar, Image, UserCheck, Users, IndianRupee, FileText, Edit, Trash2, Download } from 'lucide-react'
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
import { ZoomImage } from '../index';
import { SiteDetailSkeleton } from '../index';
const API_URL = "http://localhost:3000";

function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const managers = useSelector(state => state.manager.managers)
  const [manager, setManager] = useState(null)
  const [showReportForm, setShowReportForm] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [fadeIn, setFadeIn] = useState(false);

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
          setSite(site);
          const manager = managers.find((m) => m._id === site.manager)
          setManager(manager)
          setLoading(false);
          setTimeout(() => setFadeIn(true), 50);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Error while fetching site from DB:", err);
          setLoading(false);
          setTimeout(() => setFadeIn(true), 50);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [dispatch, id, managers]);

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

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleManagerImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleGenerateReport = () => {
    setShowReportForm(true);
  };

  const handleCloseReportForm = () => {
    setShowReportForm(false);
  };

  if (loading) {
    return <SiteDetailSkeleton />;
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
    <div className={`min-h-screen bg-gray-50 transition-all duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>

      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Sites</span>
            </button>

            <div className="flex items-center space-x-4">
              {/* Status Badge */}
              {site.isCompleted ? (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Completed</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">Active</span>
                </div>
              )}

              {/* Recycle Bin Button */}
              {user.role === 'manager' && (
                <Link
                  to={`/site/${id}/recycle-bin`}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 rounded-lg border border-gray-200 transition-all group"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm font-medium">Recycle Bin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* UPPER PART - Split 80/20 */}
        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 transform transition-all duration-500 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>

          {/* LEFT SIDE - 80% (4 columns) - Site Image */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full">
              <div className="relative h-[500px]">
                {site.siteImage ? (
                  <>
                    <ZoomImage
                      src={`${API_URL}/uploads/sites/${site.siteImage}`}
                      alt={site.siteName || "Site Image"}
                      className="w-full h-full object-cover"
                      fit="cover"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 hidden">
                      <Image className="w-16 h-16 text-gray-300 mb-2" />
                      <p className="text-gray-400">No image available</p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                    <Image className="w-16 h-16 text-gray-300 mb-2" />
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}

                {/* Gradient Overlay with Site Name */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {site.siteName || "Unnamed Site"}
                  </h1>
                  <div className="flex items-center text-white/90">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{site.location || 'Location not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - 20% (1 column) - All Details */}
          <div className="lg:col-span-1 flex flex-col space-y-2.5">

            {/* Site Details Card */}
            <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl shadow-sm p-3 border border-blue-100/50">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                Site Details
              </h3>
              <div className="space-y-1.5">
                <div className="bg-white rounded-lg p-2 border border-blue-50">
                  <p className="text-xs text-gray-500 mb-0.5">Created</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(site.createdAt)}</p>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-50">
                  <p className="text-xs text-gray-500 mb-0.5">Status</p>
                  <p className="text-sm font-semibold text-gray-900">{site.isCompleted ? 'Completed' : 'Active'}</p>
                </div>
              </div>
            </div>

            {/* Manager Details Card */}
            <div className="bg-gradient-to-br from-orange-50/50 to-white rounded-xl shadow-sm p-3 border border-orange-100/50">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center mr-2">
                  <UserCheck className="w-3.5 h-3.5 text-white" />
                </div>
                Manager
              </h3>

              {manager ? (
                <div className="space-y-1.5">
                  <div className="bg-white rounded-lg p-2 border border-orange-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {manager.managerImage ? (
                          <>
                            <ZoomImage
                              src={`${API_URL}/uploads/managers/${manager.managerImage}`}
                              alt={manager.managerName || "Manager"}
                              className="w-full h-full object-cover"
                              fit="cover"
                              onError={handleManagerImageError}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-orange-500 hidden">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-orange-500">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{manager.managerName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{manager.managerGender || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-2 border border-orange-50">
                    <div className="flex items-center text-xs text-gray-600">
                      <div className="w-5 h-5 bg-orange-100 rounded-md flex items-center justify-center mr-1.5">
                        <Phone className="w-3 h-3 text-orange-600" />
                      </div>
                      <span className="truncate font-medium">{manager.managerMobile || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-2 border border-orange-50">
                  <div className="text-center py-1.5">
                    <User className="w-5 h-5 text-gray-300 mx-auto mb-0.5" />
                    <p className="text-xs text-gray-400">No manager assigned</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5">
              {/* Workers Link */}
              <Link
                to={`/site/${id}/workers`}
                className="block bg-gradient-to-r from-[#14b8a6] to-[#0d9488] rounded-xl shadow-sm p-2.5 hover:shadow-md hover:from-[#0d9488] hover:to-[#0f766e] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Workers</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-white/80 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              
              {/* Expenses Link */}
              <Link
                to={`/site/${id}/expenses`}
                className="block bg-gradient-to-r from-[#c084fc] to-[#a855f7] rounded-xl shadow-sm p-2.5 hover:shadow-md hover:from-[#a855f7] hover:to-[#9333ea] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <IndianRupee className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Expenses</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-white/80 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Generate Report Button */}
            <button
              onClick={handleGenerateReport}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#7dd3fc] to-[#38bdf8] hover:from-[#38bdf8] hover:to-[#0ea5e9] text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Generate Report</span>
            </button>
          </div>
        </div>

        {/* Report Form Modal */}
        {showReportForm && (
          <ReportForm siteId={id} onClose={handleCloseReportForm} />
        )}

        {/* LOWER PART - Notes & Reminders (Full Width) */}
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-500 delay-200 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Notes & Reminders
                </h2>
                <p className="text-gray-600 text-sm mt-1">Site notes and observations</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <Memos siteId={id} isCompleted={site.isCompleted} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default SiteDetail