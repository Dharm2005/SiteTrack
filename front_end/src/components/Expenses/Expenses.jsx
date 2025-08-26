import React from 'react'
import AddExpenseForm from './AddExpenseForm'
import { useSelector } from 'react-redux'
import { Expense } from '../index'
import { useState } from 'react'
import { Plus, Package, TrendingUp, DollarSign, Calendar, Filter, Search, ArrowLeft, X } from 'lucide-react'
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
    // Refresh data after adding new expense
    fetchExpenses();
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
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

  // Format date for display
  const formatDateRange = () => {
    if (from && to) {
      const fromDate = new Date(from).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
      const toDate = new Date(to).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
      return `${fromDate} - ${toDate}`;
    }
    return 'All time';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header with Back Button and Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Site</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Site Expenses</h1>
                  <p className="text-gray-600">Track and manage all expenses</p>
                </div>
              </div>
            </div>

            {!showAddForm && (
              <button
                onClick={handleShowForm}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Date Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Date Range Filter</h3>
            {(from || to) && (
              <button
                onClick={clearDateFilters}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Clear</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  min={from}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Current Filter Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Filter</label>
              <div className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">{formatDateRange()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Expenses */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-gray-500 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Expenses</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {isLoading ? 'Loading...' : formatCurrency(totalExpenses)}
                  </div>
                  {(from && to) && (
                    <p className="text-xs text-gray-500 mt-1">Filtered period</p>
                  )}
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Count */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-gray-500 mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Records</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {isLoading ? 'Loading...' : (allExpenses?.length || 0)}
                  </div>
                  {(from && to) && (
                    <p className="text-xs text-gray-500 mt-1">Filtered period</p>
                  )}
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Average Expense */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-gray-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Average Cost</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {isLoading ? 'Loading...' : formatCurrency(allExpenses?.length > 0 ? totalExpenses / allExpenses.length : 0)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Per expense</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <div className="mb-8">
            <AddExpenseForm
              siteId={id}
              onClose={handleCloseForm}
            />
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
              >
                {expenseTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Info */}
            <div className="text-sm text-gray-600">
              {filteredExpenses.length} of {allExpenses?.length || 0} expenses
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-xl font-semibold text-gray-900">Expense Records</h2>
            <p className="text-gray-600 mt-1">
              {(from && to) ? `Showing expenses from ${formatDateRange()}` : 'Detailed view of all site expenses'}
            </p>
          </div>

          <div className="p-6">
            {isLoading ? (
              /* Loading State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-500">Loading expenses...</p>
              </div>
            ) : filteredExpenses && filteredExpenses.length > 0 ? (
              <div className="space-y-4">
                {filteredExpenses.map(expense => (
                  <div key={expense._id} className="hover:bg-gray-50 rounded-xl transition-colors">
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
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {searchTerm || filterType !== 'all' ? 'No matching expenses found' : 
                   (from && to) ? 'No expenses in selected period' : 'No expenses yet'}
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-8">
                  {searchTerm || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                    : (from && to) 
                      ? 'There are no expenses recorded for the selected time period. Try selecting a different date range.'
                      : 'There are no expenses listed for this site yet. Add your first expense to get started tracking costs.'
                  }
                </p>
                {!showAddForm && (!searchTerm && filterType === 'all') && (
                  <button
                    onClick={handleShowForm}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
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
    </div>
  )
}

export default Expenses