import React from 'react'
import AddExpenseForm from './AddExpenseForm'
import { useSelector } from 'react-redux'
import { Expense, ExpenseChart } from '../index'
import { useState } from 'react'
import { Plus, Package, TrendingUp, DollarSign, Calendar, Filter, Search, ArrowLeft, X, BarChart3 } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getExpensesBySite, getFilteredExpenses } from '../../services/expenseService'
import { setExpenses } from '../../features/expenseSlice'
import { useEffect } from 'react'

function Expenses() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const allExpenses = useSelector((state) => state.expense.expenses);

  const dispatch = useDispatch()

  useEffect(() => {
    fetchExpenses();
  }, [id, from, to, dispatch]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      let expenseData;
      if(from && to){
        expenseData = await getFilteredExpenses(id, from, to);
      }
      else{
        expenseData = await getExpensesBySite(id)
      }
      dispatch(setExpenses(expenseData));
    } catch (error) {
      console.error("Error fetching expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    fetchExpenses();
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const clearDateFilters = () => {
    setFrom("");
    setTo("");
  };

  // Calculate total expenses
  const totalExpenses = allExpenses?.reduce((sum, expense) => sum + (expense.totalCost || 0), 0) || 0;

  // Get unique expense types for filter
  const expenseTypes = ['all', ...new Set(allExpenses?.map(expense => expense.expenseType) || [])];

  // Filter and sort expenses based on search and type
  const filteredExpenses = allExpenses?.filter(expense => {
    const matchesSearch = expense.expenseType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || expense.expenseType === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Site Expenses</h1>
                  <p className="text-sm text-gray-600">Manage expense records</p>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-3">
              {!showAddForm && (
                <button
                  onClick={handleShowForm}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Expense</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Stats & Chart & Filters Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          
          {/* Combined Stats Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-4 h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      {isLoading ? '...' : formatCurrency(totalExpenses)}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Records</p>
                      <p className="text-xl font-bold text-gray-900">
                        {isLoading ? '...' : (allExpenses?.length || 0)}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border p-4 h-full">
              <ExpenseChart siteId={id} />
            </div>
          </div>

          {/* Compact Filters */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
                {(from || to || searchTerm || filterType !== 'all') && (
                  <button
                    onClick={() => {
                      clearDateFilters();
                      setSearchTerm('');
                      setFilterType('all');
                    }}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* Date Range - Compact */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="From"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    min={from}
                    placeholder="To"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Search & Filter Row */}
              <div className="grid grid-cols-1 gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {expenseTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active filters display */}
              {(from || to) && (
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {from && to ? `${new Date(from).toLocaleDateString()} - ${new Date(to).toLocaleDateString()}` 
                              : from ? `From ${new Date(from).toLocaleDateString()}` 
                                     : `Until ${new Date(to).toLocaleDateString()}`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="mb-6">
            <AddExpenseForm
              siteId={id}
              onClose={handleCloseForm}
            />
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Expense Records 
            {(from && to) && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({new Date(from).toLocaleDateString()} - {new Date(to).toLocaleDateString()})
              </span>
            )}
          </h2>
          <div className="text-sm text-gray-600">
            {filteredExpenses.length} of {allExpenses?.length || 0} records
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Loading expenses...</p>
            </div>
          ) : filteredExpenses && filteredExpenses.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredExpenses.map(expense => (
                <div key={expense._id} className="hover:bg-gray-50 transition-colors">
                  <Expense
                    key={expense._id}
                    id={expense._id}
                    expenseType={expense.expenseType}
                    billImage={expense.billImage}
                    quantity={expense.quantity}
                    unit={expense.unit}
                    totalCost={expense.totalCost}
                    arrivalDate={expense.arrivalDate}
                    vehicleNumber={expense.vehicleNumber}
                    createdAt={expense.createdAt}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' ? 'No matching expenses found' : 
                 (from && to) ? 'No expenses in selected period' : 'No expenses yet'}
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : (from && to) 
                    ? 'No expenses recorded for the selected time period.'
                    : 'Add your first expense to get started.'
                }
              </p>
              {!showAddForm && (!searchTerm && filterType === 'all' && !from && !to) && (
                <button
                  onClick={handleShowForm}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add First Expense</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Expenses