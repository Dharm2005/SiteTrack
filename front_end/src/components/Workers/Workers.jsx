import React, { useState } from 'react'
import AddWorkerForm from './AddWorkerForm'
import { useSelector } from 'react-redux'
import { Worker } from '../index'
import { Plus, Users } from 'lucide-react'

function Workers({siteId}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const allWorkers = useSelector((state) => state.worker.workers);

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
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
        <AddWorkerForm 
          siteId={siteId}
          onClose={handleCloseForm}
        />
      )}

      {/* Workers List */}
      {allWorkers && allWorkers.length > 0 ? (
        <div className="grid gap-4">
          {allWorkers.map(worker => (
            <div key={worker._id}>
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
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No workers found</h3>
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
  )
}

export default Workers