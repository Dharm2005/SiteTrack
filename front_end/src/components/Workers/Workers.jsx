import React, { useEffect, useState } from 'react'
import AddWorkerForm from './AddWorkerForm'
import { useDispatch, useSelector } from 'react-redux'
import { Worker, WorkerDetail } from '../index'
import { Plus, Users } from 'lucide-react'
import { getWorkersBySite } from '../../services/workerService'
import { setWorkers } from '../../features/workerSlice'
import { useParams } from 'react-router-dom'
import {Loader} from '../index'

function Workers() {
  const {user} = useSelector(state => state.auth)
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState(null);
  const [loading, setLoading] = useState(true);
  const allWorkers = useSelector((state) => state.worker.workers);
  const dispatch = useDispatch()
  const { id } = useParams()
  
 useEffect(() => {
  const fetchWorkers = async () => {
    if (allWorkers && allWorkers.length > 0) {
      setLoading(false);
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
    }
  };
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

  // Find selected worker for display
  const selectedWorker = allWorkers?.find(worker => worker._id === selectedWorkerId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full -mt-12">
        <Loader message={"Loading details..."} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header Section - Reduced padding */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Workers</h2>
              <p className="text-sm text-gray-600">
                {allWorkers?.length ? `${allWorkers.length} workers found` : 'No workers available'}
                {selectedWorker && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {selectedWorker.workerName} selected
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {user.role === 'manager' ? (<>
            {!showAddForm && (
            <button
              onClick={handleShowForm}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Worker</span>
            </button>
          )}
          </>) : (<></>)}
        </div>

        {/* Add Worker Form - Only show when needed */}
        {showAddForm && (
          <div className="mt-3">
            <AddWorkerForm
              siteId={id}
              onClose={handleCloseForm}
            />
          </div>
        )}
      </div>

      {/* Workers Section - Reduced height and spacing */}
      <div className="flex-shrink-0 mb-3">
        {allWorkers && allWorkers.length > 0 ? (
          <div className="relative">
            {/* Horizontal Scrollable Container - Reduced height */}
            <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-1 py-1">
              <div className="flex space-x-4 min-w-max">
                {allWorkers.map(worker => (
                  <div 
                    key={worker._id} 
                    className={`flex-shrink-0 w-32 cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedWorkerId === worker._id ? 'ring-2 ring-blue-500 ring-offset-1 rounded-lg' : ''}`}
                    onClick={() => handleWorkerSelect(
                      worker._id,
                      worker.workerName
                    )}
                  >
                    <Worker
                      key={worker._id}
                      id={worker._id}
                      name={worker.workerName}
                      image={worker.workerImage}
                      mobile={worker.workerMobile}
                      createdAt={worker.createdAt}
                      isSettled={worker.isSettled}
                      loading = {loading}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Indicator */}
            {allWorkers.length > 4 && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-gray-50 to-transparent w-6 h-full pointer-events-none flex items-center justify-end pr-1">
                <div className="w-0.5 h-6 bg-gray-300 rounded-full opacity-50"></div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State - Reduced padding */
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">No workers found</h3>
            <p className="text-sm text-gray-500 text-center max-w-md mb-3">
              There are no workers assigned to this site yet.
            </p>
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
          </div>
        )}
      </div>

      {/* Worker Detail Section - Maximized space */}
      <div className="flex-1 min-h-0">
        {selectedWorkerId ? (
          <WorkerDetail
            workerId={selectedWorkerId}
            workerName={selectedWorkerName}
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
  )
}

export default Workers