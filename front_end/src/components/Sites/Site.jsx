import React, { useState } from 'react';
import { MapPin, User, Phone, Calendar, ImageIcon, Loader2, Edit, Trash2, X, Search, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSiteFromDB, markSiteCompleted } from '../../services/siteService';
import { deleteSite, updateSite } from '../../features/siteSlice'
import { toast } from 'react-toastify';
import ZoomImage from '../Layout/ZoomImage';

const API_URL = "http://localhost:3000";

function Site({ id, name, location, image, managerId, createdAt, isCompleted }) {
  const { user } = useSelector(state => state.auth);
  const managers = useSelector(state => state.manager.managers)
  const manager = managers.find((m) => m._id === managerId)
  const dispatch = useDispatch()
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error(error);
      return 'Invalid Date';
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name || 'this site'}"?`);

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      // ✅ Call backend first (no animation yet)
      const res = await deleteSiteFromDB(id);

      if (res.success === false) {
        toast.error(res.message || " Something went wrong");
        setIsDeleting(false);
        return;
      }

      // ✅ Backend confirmed → now start fade animation
      setIsAnimatingOut(true);

      // Small delay for fade-out animation
      await new Promise(resolve => setTimeout(resolve, 300));

      // Remove from Redux store after fade-out
      setTimeout(() => {
        dispatch(deleteSite(id));
      }, 400);

    } catch (error) {
      console.error("Error while deleting site", error);
      toast.error("❌ Failed to delete site. Please try again.");
      // Reset states on error
      setIsDeleting(false);
      setIsAnimatingOut(false);
    }
  };

  const handleComplete = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to complete this site?");

      if (confirm) {
        setIsCompleting(true);
        const site = await markSiteCompleted(id);

        if (site) {
          dispatch(updateSite(site))
        }
        setIsCompleting(false);
      }

    } catch (error) {
      console.error("error while completing site", error);
      setIsCompleting(false);
    }
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 group hover:scale-105 ${isAnimatingOut
      ? 'opacity-0 scale-95 transform translate-y-4'
      : 'opacity-100 scale-100 transform translate-y-0'
      } ${isDeleting ? 'pointer-events-none' : ''}`}>
      {/* Large Image Section */}
      <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {image ? (
          <>
            <div className="relative w-full h-full">
              <ZoomImage
                src={`${API_URL}/uploads/sites/${image}`}
                alt={name || 'Site Image'}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            {/* Fallback icon - hidden by default */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 hidden">
              <ImageIcon className="w-20 h-20 text-white/70" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <ImageIcon className="w-20 h-20 text-white/70" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none"></div>

        {/* Site name overlay */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
          <h3 className="text-white text-2xl font-bold truncate drop-shadow-lg">
            {name || 'Unnamed Site'}
          </h3>
        </div>

        {/* Deleting Overlay */}
        {isDeleting && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white bg-opacity-90 rounded-full p-4">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Compact Details Section */}
      <div className="p-6">
        {/* Two Column Layout for Details */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Location */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-medium text-gray-500">Location</span>
              </div>
              <p className="text-gray-900 font-medium truncate">
                {location || 'Not specified'}
              </p>
            </div>

            {/* Manager Name */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-500">Manager</span>
              </div>
              <p className="text-gray-900 font-medium truncate">
                {manager?.managerName || 'Not assigned'}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Created Date */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-500">Created</span>
              </div>
              <p className="text-gray-900 font-medium">
                {formatDate(createdAt)}
              </p>
            </div>

            {/* Site Status */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-blue-600" />
                )}
                <span className="text-sm font-medium text-gray-500">Status</span>
              </div>
              <div className="flex items-center">
                {isCompleted ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-6">
          <Link
            to={`/site/${id}`}
            className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-center ${isDeleting ? 'opacity-50 pointer-events-none' : ''
              }`}
          >
            View Details
          </Link>

          {!isCompleted ? (
            <>
              {user.role === 'admin' ? (
                <>
                  {/* Edit Button Icon */}
                  <Link
                    to={`/edit-site/${id}`}
                    className={`p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md ${isDeleting ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    title="Edit Site"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>

                  {/* Delete Button Icon */}
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`p-3 transition-all duration-200 transform hover:scale-105 shadow-md rounded-xl ${isDeleting
                      ? 'bg-red-300 text-red-600 cursor-not-allowed'
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                      }`}
                    title="Delete Site"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={handleComplete}
                    disabled={isCompleting || isDeleting}
                    className={`p-3 transition-all duration-200 transform hover:scale-105 shadow-md rounded-xl ${isCompleting || isDeleting
                      ? 'bg-emerald-300 text-emerald-600 cursor-not-allowed'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                      }`}
                    title="Mark as Completed"
                  >
                    {isCompleting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </button>
                </>
              ) : (<></>)}
            </>
          ) : (<></>)}

        </div>
      </div>
    </div>
  );
}

export default Site;