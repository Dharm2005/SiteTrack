import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAdvancesByWorker } from '../../services/workerService';
import { setAdvances } from '../../features/workerAdvanceSlice';
import Advance from './Advance';
import AddAdvanceForm from './AddAdvanceForm';
import { Plus, DollarSign, ArrowLeft } from 'lucide-react';

function WorkerDetail({workerId}) {
  const allAdvance = useSelector(state => state.advance.advances);
  const dispatch = useDispatch();
  const [showAddForm, setShowAddForm] = useState(false);

  console.log("all", allAdvance);

  useEffect(() => {
    const fetchAdvance = async () => {
      try {
        const advance = await getAdvancesByWorker(workerId);
        dispatch(setAdvances(advance))
      } catch (error) {
        console.error("Error while fetching advance", error);
      }
    }
    fetchAdvance()
  }, [dispatch, workerId])

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  const totalAdvances = allAdvance?.reduce((sum, advance) => sum + parseFloat(advance.amount || 0), 0) || 0;

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Worker Advances</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{allAdvance?.length || 0} advances</span>
                <span>•</span>
                <span className="font-medium text-green-600">
                  Total: ₹{totalAdvances.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {!showAddForm && (
          <button
            onClick={handleShowForm}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Advance</span>
          </button>
        )}
      </div>

      {/* Add Advance Form - Only show when needed */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm">
          <AddAdvanceForm 
            workerId={workerId}
            onClose={handleCloseForm}
          />
        </div>
      )}

      {/* Advances List */}
      {allAdvance && allAdvance.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Advance History</h3>
          </div>
          <div className="space-y-0">
            {allAdvance.map(advance => (
              <Advance
                key={advance._id}
                amount={advance.amount}
                date={advance.date}
                note={advance.note}
                createdAt={advance.createdAt}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No advances found</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            This worker hasn't received any advances yet. Add the first advance to get started.
          </p>
          {!showAddForm && (
            <button
              onClick={handleShowForm}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Advance</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default WorkerDetail