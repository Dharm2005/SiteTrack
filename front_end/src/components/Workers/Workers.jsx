import React, { useEffect, useState } from 'react'
import AddWorkerForm from './AddWorkerForm'
import { useDispatch, useSelector } from 'react-redux'
import { Worker, WorkerDetail } from '../index'
import { Plus, Users, ArrowLeft } from 'lucide-react'
import { getWorkersBySite } from '../../services/workerService'
import { setWorkers } from '../../features/workerSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../index'
import { getSite } from '../../services/siteService'
import { WorkersSkeleton } from '../index'

function Workers() {
  const { user } = useSelector(state => state.auth)
  const [site, setSite] = useState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const allWorkers = useSelector((state) => state.worker.workers);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const getCurrSite = useSelector(
    (state) => state.site.sites.find(s => s._id === id)
  );

  useEffect(() => {
    if (getCurrSite) {
      setSite(getCurrSite);
    }
  }, [getCurrSite]);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const site = await getSite(id)
        setSite(site);
      } catch (error) {
        console.error("Error fetching site", error);
      }
    }

    const fetchWorkers = async () => {
      if (allWorkers && allWorkers.length > 0) {
        setLoading(false);

        if (!selectedWorkerId && allWorkers.length > 0) {
          setSelectedWorkerId(allWorkers[0]._id);
          setSelectedWorkerName(allWorkers[0].workerName);
        }

        setTimeout(() => setFadeIn(true), 50);
        return; // Skip fetch
      }
      try {
        setLoading(true);
        const workerData = await getWorkersBySite(id);
        dispatch(setWorkers(workerData));
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false);
        // Trigger fade-in animation after loading
        setTimeout(() => setFadeIn(true), 50);
      }
    };
    if (!site) {
      fetchSite()
    }
    fetchWorkers();
  }, [id, dispatch]); // <-- no allWorkers here


  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  const handleWorkerSelect = (workerId, workerName) => {
    setSelectedWorkerId(workerId);
    setSelectedWorkerName(workerName);
  };

  const handleBackClick = () => {
    navigate(`/site/${id}`);
  };

  // Show skeleton while loading
  if (loading) {
    return <WorkersSkeleton />;
  }

  return (
    <div className={`h-full flex flex-col transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Site Workers</h1>
                  <p className="text-sm text-gray-600">Manage worker records</p>
                </div>
              </div>
            </div>

            {/* Right section */}
            {!site?.isCompleted ? (
              <>
                {user.role === 'manager' ? (
                  <>
                    <div className="flex items-center space-x-3">
                      {!showAddForm && (
                        <button
                          onClick={handleShowForm}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">Add Worker</span>
                        </button>
                      )}
                    </div>
                  </>
                ) : <></>}
              </>
            ) : (<></>)}
          </div>
        </div>

        {/* Add Worker Form - Only show when needed */}
        {showAddForm && (
          <div className={`border-t border-gray-200 bg-gray-50 transition-all duration-500 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-4 py-4">
              <AddWorkerForm
                siteId={id}
                onClose={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content with proper spacing */}
      <div className="flex-1 flex flex-col px-4 pt-6 pb-4">
        {/* Workers Section */}
        <div className={`flex-shrink-0 mb-6 transition-all duration-500 delay-100 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {allWorkers && allWorkers.length > 0 ? (
            <div className="relative">
              {/* Horizontal Scrollable Container with padding for hover effects */}
              <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-2">
                <div className="flex space-x-4 min-w-max">
                  {allWorkers.map((worker, index) => (
                    <div
                      key={worker._id}
                      className={`flex-shrink-0 w-32 cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedWorkerId === worker._id
                        ? 'ring-3 ring-blue-500 ring-offset-2 rounded-lg'
                        : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 rounded-lg'
                        } ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                      style={{ transitionDelay: `${200 + index * 100}ms` }}
                      onClick={() => handleWorkerSelect(
                        worker._id,
                        worker.workerName
                      )}
                    >
                      <Worker
                        key={worker._id}
                        id={worker._id}
                        siteId={id}
                        name={worker.workerName}
                        image={worker.workerImage}
                        mobile={worker.workerMobile}
                        createdAt={worker.createdAt}
                        isSettled={worker.isSettled}
                        loading={loading}
                        isSiteCompleted={site?.isCompleted}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll Indicator */}
              {allWorkers.length > 4 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-gray-50 to-transparent w-6 h-full pointer-events-none flex items-center justify-end pr-1">
                  <div className="w-0.5 h-6 bg-gray-300 rounded-full opacity-50"></div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">No workers found</h3>
              <p className="text-sm text-gray-500 text-center max-w-md mb-3">
                There are no workers assigned to this site yet.
              </p>
              {!site?.isCompleted ? (
                <>
                  {user.role === 'manager' ? (
                    <>
                      {!showAddForm && (
                        <button
                          onClick={handleShowForm}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add First Worker</span>
                        </button>
                      )}
                    </>
                  ) : (<></>)}
                </>
              ) : (<></>)}
            </div>
          )}
        </div>

        {/* Worker Detail Section - Maximized space */}
        <div className={`flex-1 min-h-0 transition-all duration-500 delay-300 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {selectedWorkerId ? (
            <WorkerDetail
              workerId={selectedWorkerId}
              siteId={id}
              workerName={selectedWorkerName}
              isSiteCompleted={site?.isCompleted}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-700 mb-2">No Worker Selected</h3>
              <p className="text-sm text-gray-500 text-center">
                {allWorkers?.length > 0
                  ? "Click on a worker above to view their details and advances"
                  : "Add workers to get started"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Workers