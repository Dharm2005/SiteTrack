import React, { useEffect, useState } from 'react'
import AddWorkerForm from './AddWorkerForm'
import { useDispatch, useSelector } from 'react-redux'
import { Worker, WorkerDetail } from '../index'
import { Plus, Users } from 'lucide-react'
import { getWorkersBySite } from '../../services/workerService'
import { setWorkers } from '../../features/workerSlice'
import { useParams } from 'react-router-dom'

function Workers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const allWorkers = useSelector((state) => state.worker.workers);
  const dispatch = useDispatch()
  const {id} = useParams()

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        if(!allWorkers || allWorkers.length === 0){
          const workerData = await getWorkersBySite(id);
          dispatch(setWorkers(workerData));
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, [id, dispatch ,allWorkers]);


  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section - Takes minimal space */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Workers</h2>
              <p className="text-gray-600">
                {allWorkers?.length ? `${allWorkers.length} workers found` : 'No workers available'}
              </p>
            </div>
          </div>

          {!showAddForm && (
            <button
              onClick={handleShowForm}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Worker</span>
            </button>
          )}
        </div>

        {/* Add Worker Form - Only show when needed */}
        {showAddForm && (
          <div className="mt-6">
            <AddWorkerForm
              siteId={id}
              onClose={handleCloseForm}
            />
          </div>
        )}
      </div>

      {/* Workers Section - Takes about 35-40% of remaining space */}
      <div className="flex-shrink-0 mb-8">
        {allWorkers && allWorkers.length > 0 ? (
          <div className="relative">
            {/* Horizontal Scrollable Container */}
            <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="flex space-x-4 min-w-max px-1">
                {allWorkers.map(worker => (
                  <div key={worker._id} className="flex-shrink-0 w-40">
                    <Worker
                      key={worker._id}
                      id={worker._id}
                      name={worker.workerName}
                      image={worker.workerImage}
                      mobile={worker.workerMobile}
                      createdAt={worker.createdAt}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Indicator */}
            {allWorkers.length > 3 && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-gray-50 to-transparent w-8 h-full pointer-events-none flex items-center justify-end pr-2">
                <div className="w-1 h-8 bg-gray-300 rounded-full opacity-50"></div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              There are no workers assigned to this site yet. Add your first worker to get started.
            </p>
            {!showAddForm && (
              <button
                onClick={handleShowForm}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Add First Worker</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty Space for Additional Fields - Takes 60-65% of page */}
      <div>
        <WorkerDetail />
      </div>
    </div>
  )
}

export default Workers