import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAdvancesByWorker, getEarnByWorker, settledWorkerInDB } from '../../services/workerService';
import { setAdvances } from '../../features/workerAdvanceSlice';
import Advance from './Advance';
import Earn from './Earn';
import AddAdvanceForm from './AddAdvanceForm';
import { Plus, DollarSign, ArrowLeft, Calculator, TrendingUp, TrendingDown, Calendar, FileText, Lock, IndianRupee } from 'lucide-react';
import { setEarn } from '../../features/workerEarnSlice';
import AddEarnForm from './AddEarnForm';
import { updateWorker } from '../../features/workerSlice';

function WorkerDetail({ workerId, workerName }) {
  const {user} = useSelector(state => state.auth)
  const worker = useSelector(state =>
    state.worker.workers.find(w =>
      w._id === workerId
    ))

  const isSettled = worker?.isSettled || false;

  const allAdvance = useSelector(state => state.advance.advances);
  const allEarn = useSelector(state => state.earn.earnings)
  const dispatch = useDispatch();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPage, setSelectedPage] = useState('settlement');
  const [settledCheck, setSettledCheck] = useState(isSettled);
  const [localIsSettled, setLocalIsSettled] = useState(isSettled)

  useEffect(() => {
    const fetchEarn = async () => {
      try {
        const earn = await getEarnByWorker(workerId);
        dispatch(setEarn(earn))
      } catch (error) {
        console.error("Error while fetching earn", error);
      }
    }
    const fetchAdvance = async () => {
      try {
        const advance = await getAdvancesByWorker(workerId);
        dispatch(setAdvances(advance))
      } catch (error) {
        console.error("Error while fetching advance", error);
      }
    }
    fetchEarn()
    fetchAdvance()
  }, [dispatch, workerId])

  const handleSettlement = async (e) => {
    e.preventDefault();
    try {
      const confirm = window.confirm("Are you sure ? you can not change it leter")

      if (!confirm) {
        return;
      } else {

        const check = settledCheck;

        const res = await settledWorkerInDB(workerId, { isSettled: check });

        if (res) {
          dispatch(updateWorker(res));
          setSettledCheck(res.isSettled);
          setLocalIsSettled(res.isSettled);
        }
      }
    } catch (error) {
      console.error("Error while settling worker", error);
    }
  }

  useEffect(() => {
    setLocalIsSettled(isSettled);
  }, [isSettled])

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  const totalAdvances = allAdvance?.reduce((sum, advance) => sum + parseFloat(advance.amount || 0), 0) || 0;

  const totalEarn = allEarn?.reduce((sum, earn) => sum + parseFloat(earn.amount || 0), 0) || 0;

  const totalPayable = totalEarn - totalAdvances;

  return (
    <>
      {/* Settled Banner */}
      {localIsSettled && (
        <div className="mb-4 bg-gray-100 border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Lock className="w-5 h-5 text-gray-700" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">Settlement Completed</h3>
              <p className="text-sm text-gray-700">This worker's account has been settled and is now read-only</p>
            </div>
          </div>
        </div>
      )}

      <nav className="mb-6">
        <div className="flex items-center justify-between">
          {/* Navigation Tabs */}
          <div className={`flex p-1 rounded-lg w-fit ${localIsSettled ? 'bg-gray-100' : 'bg-gray-100'}`}>
            <button
              onClick={() => setSelectedPage("settlement")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${selectedPage === 'settlement'
                ? localIsSettled
                  ? 'bg-gray-200 text-gray-800 shadow-sm'
                  : 'bg-white text-gray-900 shadow-sm'
                : localIsSettled
                  ? 'text-gray-600 hover:text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Final Settlement
            </button>
            <button
              onClick={() => setSelectedPage("earn")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${selectedPage === 'earn'
                ? localIsSettled
                  ? 'bg-gray-200 text-gray-800 shadow-sm'
                  : 'bg-white text-gray-900 shadow-sm'
                : localIsSettled
                  ? 'text-gray-600 hover:text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setSelectedPage("advance")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${selectedPage === 'advance'
                ? localIsSettled
                  ? 'bg-gray-200 text-gray-800 shadow-sm'
                  : 'bg-white text-gray-900 shadow-sm'
                : localIsSettled
                  ? 'text-gray-600 hover:text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Advances
            </button>

          </div>

          {/* Total Payable Amount */}
          <div className={`rounded-lg px-6 py-3 shadow-sm border ${localIsSettled ? 'bg-gray-100 border-gray-300' : 'bg-white'}`}>
            <div className="flex items-center space-x-4">
              <div className={`text-sm font-medium ${localIsSettled ? 'text-gray-700' : 'text-gray-600'}`}>
                Total Payable Amount:
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`font-semibold ${localIsSettled ? 'text-gray-700' : 'text-blue-600'}`}>₹{totalEarn.toLocaleString()}</span>
                <span className="text-gray-400">-</span>
                <span className={`font-semibold ${localIsSettled ? 'text-gray-700' : 'text-red-600'}`}>₹{totalAdvances.toLocaleString()}</span>
                <span className="text-gray-400">=</span>
                <span className={`font-bold text-lg px-3 py-1 rounded-lg ${localIsSettled
                  ? 'text-gray-800 bg-gray-200'
                  : totalPayable >= 0
                    ? 'text-green-700 bg-green-100'
                    : 'text-red-700 bg-red-100'
                  }`}>
                  ₹{totalPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {selectedPage === 'advance' ? (
        <div className={`space-y-4 p-4 min-h-screen ${localIsSettled ? 'bg-gray-50' : 'bg-gray-50'}`}>
          {/* Header Section */}
          <div className={`flex items-center justify-between p-4 rounded-xl shadow-sm ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${localIsSettled ? 'bg-gray-200' : 'bg-red-100'}`}>
                  <TrendingDown className={`w-7 h-7 ${localIsSettled ? 'text-gray-700' : 'text-red-600'}`} />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${localIsSettled ? 'text-gray-800' : 'text-gray-900'}`}>{workerName}'s Advances</h1>
                  <div className={`flex items-center space-x-4 text-sm ${localIsSettled ? 'text-gray-700' : 'text-gray-600'}`}>
                    <span>{allAdvance?.length || 0} advances</span>
                    <span>•</span>
                    <span className={`font-medium ${localIsSettled ? 'text-gray-700' : 'text-red-600'}`}>
                      Total: ₹{totalAdvances.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {user.role === 'manager' ? (<>
            {!showAddForm && !localIsSettled && (
              <button
                onClick={handleShowForm}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-400 to-rose-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-500 hover:to-rose-500 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Add Advance</span>
              </button>
            )}
            </>) : (<></>)}
          </div>

          {/* Add Advance Form - Only show when needed */}
          {showAddForm && !localIsSettled && (
            <div className="bg-white rounded-xl shadow-sm">
              <AddAdvanceForm
                workerId={workerId}
                onClose={handleCloseForm}
              />
            </div>
          )}

          {/* Advances List */}
          {allAdvance && allAdvance.length > 0 ? (
            <div className={`rounded-xl shadow-sm overflow-hidden ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
              <div className={`p-4 ${localIsSettled ? 'border-b border-gray-300' : 'border-b border-gray-100'}`}>
                <h3 className={`text-lg font-semibold ${localIsSettled ? 'text-gray-800' : 'text-gray-900'}`}>Advance History</h3>
              </div>
              <div className="space-y-0">
                {allAdvance.map(advance => (
                  <Advance
                    key={advance._id}
                    id={advance._id}
                    amount={advance.amount}
                    date={advance.date}
                    note={advance.note}
                    createdAt={advance.createdAt}
                    isSettled={isSettled}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className={`flex flex-col items-center justify-center py-12 rounded-xl shadow-sm ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${localIsSettled ? 'bg-gray-200' : 'bg-gray-100'}`}>
                <IndianRupee className={`w-12 h-12 ${localIsSettled ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-medium mb-2 ${localIsSettled ? 'text-gray-800' : 'text-gray-900'}`}>No advances found</h3>
              <p className={`text-center max-w-md mb-6 ${localIsSettled ? 'text-gray-700' : 'text-gray-500'}`}>
                This worker hasn't received any advances yet. 
              </p>

              {user.role === 'manager' ? (
                <>
                {!showAddForm && !localIsSettled && (
                <button
                  onClick={handleShowForm}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-400 to-rose-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-500 hover:to-rose-500 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add First Advance</span>
                </button>
              )}
                </>
              ) : (<></>)}
            </div>
          )}
        </div>
      ) : (<></>)}

      {selectedPage === 'earn' ? (
        <div className={`space-y-4 p-4 min-h-screen ${localIsSettled ? 'bg-gray-50' : 'bg-gray-50'}`}>
          {/* Header Section */}
          <div className={`flex items-center justify-between p-4 rounded-xl shadow-sm ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${localIsSettled ? 'bg-gray-200' : 'bg-green-100'}`}>
                  <TrendingUp className={`w-7 h-7 ${localIsSettled ? 'text-gray-700' : 'text-green-600'}`} />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${localIsSettled ? 'text-gray-800' : 'text-gray-900'}`}>{workerName}'s Earnings</h1>
                  <div className={`flex items-center space-x-4 text-sm ${localIsSettled ? 'text-gray-700' : 'text-gray-600'}`}>
                    <span>{allEarn?.length || 0} earnings</span>
                    <span>•</span>
                    <span className={`font-medium ${localIsSettled ? 'text-gray-700' : 'text-green-600'}`}>
                      Total: ₹{totalEarn.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {user.role === 'manager' ? (<>
              {!showAddForm && !localIsSettled && (
              <button
                onClick={handleShowForm}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Add Earning</span>
              </button>
            )}
            </>) : <></>}
          </div>

          {/* Add Earning Form - Only show when needed */}
          {showAddForm && !localIsSettled && (
            <div className="bg-white rounded-xl shadow-sm">
              <AddEarnForm
                workerId={workerId}
                onClose={handleCloseForm}
              />
            </div>
          )}

          {/* Earning List */}
          {allEarn && allEarn.length > 0 ? (
            <div className={`rounded-xl shadow-sm overflow-hidden ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
              <div className={`p-4 ${localIsSettled ? 'border-b border-gray-300' : 'border-b border-gray-100'}`}>
                <h3 className={`text-lg font-semibold ${localIsSettled ? 'text-gray-800' : 'text-gray-900'}`}>Earning History</h3>
              </div>
              <div className="space-y-0">
                {allEarn.map(earn => (
                  <Earn
                    key={earn._id}
                    id={earn._id}
                    amount={earn.amount}
                    date={earn.date}
                    note={earn.note}
                    createdAt={earn.createdAt}
                    isSettled={isSettled}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className={`flex flex-col items-center justify-center py-12 rounded-xl shadow-sm ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${localIsSettled ? 'bg-gray-200' : 'bg-gray-100'}`}>
                <IndianRupee className={`w-12 h-12 ${localIsSettled ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-medium mb-2 ${localIsSettled ? 'text-gray-800' : 'text-gray-900'}`}>No Earning found</h3>
              <p className={`text-center max-w-md mb-6 ${localIsSettled ? 'text-gray-700' : 'text-gray-500'}`}>
                This worker hasn't earned any amount yet. 
              </p>
              {user.role === 'manager' ? (<>
              {!showAddForm && !localIsSettled && (
              <button
                onClick={handleShowForm}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Add Earning</span>
              </button>
            )}
            </>) : <></>}
            </div>
          )}
        </div>
      ) : (<></>)}

      {selectedPage === 'settlement' ? (
        <div className={`space-y-6 p-4 min-h-screen ${localIsSettled ? 'bg-gray-50' : 'bg-gray-50'}`}>
          {/* Header Section */}
          <div className={`p-4 rounded-xl shadow-sm ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${localIsSettled ? 'bg-gray-200' : 'bg-blue-100'}`}>
                <Calculator className={`w-7 h-7 ${localIsSettled ? 'text-gray-700' : 'text-blue-600'}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${localIsSettled ? 'text-gray-800' : 'text-gray-900'}`}>{workerName}'s Final Settlement</h1>
                <div className={`flex items-center space-x-4 text-sm ${localIsSettled ? 'text-gray-700' : 'text-gray-600'}`}>
                  <span>Settlement Summary</span>
                  <span>•</span>
                  <span className={`font-medium ${localIsSettled ? 'text-gray-700' : 'text-blue-600'}`}>
                    Status: {localIsSettled ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Earnings Section */}
            <div className={`rounded-xl shadow-sm overflow-hidden ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
              <div className={`p-3 ${localIsSettled ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">All Earnings</h3>
                    <p className={`text-sm ${localIsSettled ? 'text-gray-700' : 'text-green-600'}`}>{allEarn?.length || 0} transactions</p>
                  </div>
                  <div className={`p-2 rounded-lg ${localIsSettled ? 'bg-gray-300' : 'bg-green-200'}`}>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {allEarn && allEarn.length > 0 ? (
                  <div className={`${localIsSettled ? 'divide-y divide-gray-300' : 'divide-y divide-gray-100'}`}>
                    {allEarn.map((earn, index) => (
                      <div key={earn._id || index} className={`p-3 transition-colors ${localIsSettled ? 'hover:bg-gray-200' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className={`flex items-center text-xs ${localIsSettled ? 'text-gray-700' : 'text-gray-500'}`}>
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(earn.date || earn.createdAt).toLocaleDateString()}
                          </div>
                          <span className={`font-semibold ${localIsSettled ? 'text-gray-700' : 'text-green-600'}`}>₹{parseFloat(earn.amount).toLocaleString()}</span>
                        </div>
                        {earn.note && (
                          <div className="flex items-start space-x-2">
                            <FileText className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600 line-clamp-2">{earn.note}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No earnings recorded</p>
                  </div>
                )}
              </div>

              <div className={`p-3 ${localIsSettled ? 'bg-gray-200 border-t border-gray-300' : 'bg-green-50 border-t border-green-100'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium text-sm ${localIsSettled ? 'text-gray-800' : 'text-green-700'}`}>Total Earnings:</span>
                  <span className={`font-bold ${localIsSettled ? 'text-gray-800' : 'text-green-800'}`}>₹{totalEarn.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Advances Section */}
            <div className={`rounded-xl shadow-sm overflow-hidden ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
              <div className={`p-3 ${localIsSettled ? 'bg-gray-200 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">All Advances</h3>
                    <p className={`text-sm ${localIsSettled ? 'text-gray-700' : 'text-red-600'}`}>{allAdvance?.length || 0} transactions</p>
                  </div>
                  <div className={`p-2 rounded-lg ${localIsSettled ? 'bg-gray-300' : 'bg-red-200'}`}>
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {allAdvance && allAdvance.length > 0 ? (
                  <div className={`${localIsSettled ? 'divide-y divide-gray-300' : 'divide-y divide-gray-100'}`}>
                    {allAdvance.map((advance, index) => (
                      <div key={advance._id || index} className={`p-3 transition-colors ${localIsSettled ? 'hover:bg-gray-200' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className={`flex items-center text-xs ${localIsSettled ? 'text-gray-700' : 'text-gray-500'}`}>
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(advance.date || advance.createdAt).toLocaleDateString()}
                          </div>
                          <span className={`font-semibold ${localIsSettled ? 'text-gray-700' : 'text-red-600'}`}>₹{parseFloat(advance.amount).toLocaleString()}</span>
                        </div>
                        {advance.note && (
                          <div className="flex items-start space-x-2">
                            <FileText className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-600 line-clamp-2">{advance.note}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <TrendingDown className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No advances recorded</p>
                  </div>
                )}
              </div>

              <div className={`p-3 ${localIsSettled ? 'bg-gray-200 border-t border-gray-300' : 'bg-red-50 border-t border-red-100'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium text-sm ${localIsSettled ? 'text-gray-800' : 'text-red-700'}`}>Total Advances:</span>
                  <span className={`font-bold ${localIsSettled ? 'text-gray-800' : 'text-red-800'}`}>₹{totalAdvances.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Final Payment Section */}
            <div className={`rounded-xl shadow-sm overflow-hidden ${localIsSettled ? 'bg-gray-100' : 'bg-white'}`}>
              <div className={`p-3 ${localIsSettled
                ? 'bg-gray-200 text-gray-800'
                : totalPayable >= 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Final Payment</h3>
                    <p className={`text-sm ${localIsSettled
                      ? 'text-gray-700'
                      : totalPayable >= 0
                        ? 'text-blue-600'
                        : 'text-orange-600'
                      }`}>
                      {totalPayable >= 0 ? 'Amount to Pay' : 'Amount Overpaid'}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${localIsSettled
                    ? 'bg-gray-300'
                    : totalPayable >= 0
                      ? 'bg-blue-200'
                      : 'bg-orange-200'
                    }`}>
                    <Calculator className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="text-center mb-4">
                  <div className={`text-3xl font-bold mb-1 ${localIsSettled
                    ? 'text-gray-800'
                    : totalPayable >= 0
                      ? 'text-blue-600'
                      : 'text-orange-600'
                    }`}>
                    ₹{Math.abs(totalPayable).toLocaleString()}
                  </div>
                  <p className={`text-xs ${localIsSettled ? 'text-gray-700' : 'text-gray-500'}`}>
                    {totalPayable >= 0 ? 'To be paid to worker' : 'Worker owes company'}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`${localIsSettled ? 'text-gray-700' : 'text-gray-600'}`}>Total Earnings:</span>
                    <span className={`font-medium ${localIsSettled ? 'text-gray-700' : 'text-green-600'}`}>₹{totalEarn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`${localIsSettled ? 'text-gray-700' : 'text-gray-600'}`}>Total Advances:</span>
                    <span className={`font-medium ${localIsSettled ? 'text-gray-700' : 'text-red-600'}`}>₹{totalAdvances.toLocaleString()}</span>
                  </div>
                  <hr className={`${localIsSettled ? 'border-gray-300' : 'border-gray-200'}`} />
                  <div className="flex justify-between items-center">
                    <span className={`font-medium text-sm ${localIsSettled ? 'text-gray-800' : 'text-gray-900'}`}>Final Amount:</span>
                    <span className={`font-bold text-sm ${localIsSettled
                      ? 'text-gray-800'
                      : totalPayable >= 0
                        ? 'text-blue-600'
                        : 'text-orange-600'
                      }`}>
                      ₹{totalPayable.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Settlement form or completed message */}
                {user.role === 'manager' ? (
                  <>
                  {localIsSettled ? (
                  <div className="bg-gray-200 p-4 rounded-lg border border-gray-300">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className="p-2 bg-gray-300 rounded-lg">
                          <Lock className="w-5 h-5 text-gray-700" />
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-2">Settlement Completed</h4>
                      <p className="text-xs text-gray-700 mb-3">
                        This worker's payment has been marked as settled and completed.
                      </p>
                      <div className="bg-gray-300 p-3 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-800">
                          <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                          <span>Account Status: Settled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <form onSubmit={handleSettlement} className="space-y-4">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Settlement Action</h4>
                        <p className="text-xs text-gray-600">Mark this worker's payment as complete</p>
                      </div>

                      {/* Checkbox Section */}
                      <div className="flex items-center justify-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="relative">
                          <input
                            id="isSettled"
                            name="isSettled"
                            type="checkbox"
                            checked={settledCheck}
                            onChange={(e) => setSettledCheck(e.target.checked)}
                            className="h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
                          />
                          {settledCheck && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <label
                          htmlFor="isSettled"
                          className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                        >
                          Mark as Settled & Paid
                        </label>
                      </div>

                      {/* Warning Message */}
                      {settledCheck && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0">
                              <svg className="w-4 h-4 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-amber-800">Important Notice</h5>
                              <p className="text-xs text-amber-700 mt-1">
                                This action cannot be undone. Ensure payment has been completed before marking as settled.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        type="submit"
                        disabled={!settledCheck}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 transform ${settledCheck
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {settledCheck ? (
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Complete Settlement</span>
                          </div>
                        ) : (
                          'Select checkbox to enable'
                        )}
                      </button>

                      {/* Status Indicator */}
                      {settledCheck && (
                        <div className="flex items-center justify-center space-x-2 text-xs text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Ready to complete settlement</span>
                        </div>
                      )}
                    </form>
                  </div>
                )}
                  </>
                ) : (<></>)}
              </div>
            </div>
          </div>
        </div>
      ) : (<></>)}
    </>
  )
}

export default WorkerDetail