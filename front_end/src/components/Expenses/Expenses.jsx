import React from 'react'
import AddExpenseForm from './AddExpenseForm'
import { useSelector } from 'react-redux'
import { Expense } from '../index'
import { useState } from 'react'
import { Plus, Package, TrendingUp, DollarSign, Calendar, Filter, Search, ArrowLeft } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getExpensesBySite } from '../../services/expenseService'
import { setExpenses } from '../../features/expenseSlice'
import { useEffect } from 'react'

function Expenses() {

  const {id} = useParams()
  const navigate = useNavigate()

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const allExpenses = useSelector((state) => state.expense.expenses);
  
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenseData = await getExpensesBySite(id);
        console.log(expenseData);
        
        dispatch(setExpenses(expenseData));
      } catch (error) {
        console.error("Error fetching expense:", error);
      }
    };
    fetchExpenses();
  }, [id, dispatch]);

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleShowForm = () => {
    setShowAddForm(true);
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Calculate total expenses
  const totalExpenses = allExpenses?.reduce((sum, expense) => sum + (expense.totalCost || 0), 0) || 0;

  // Get unique expense types for filter
  const expenseTypes = ['all', ...new Set(allExpenses?.map(expense => expense.expenseType) || [])];

  // Filter expenses based on search and type
  const filteredExpenses = allExpenses?.filter(expense => {
    const matchesSearch = expense.expenseType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || expense.expenseType === filterType;
    return matchesSearch && matchesType;
  }) || [];

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
                    {formatCurrency(totalExpenses)}
                  </div>
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
                    {allExpenses?.length || 0}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Latest Entry</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {allExpenses?.length > 0 ? 'Today' : 'None'}
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Calendar className="w-8 h-8 text-white" />
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
            <p className="text-gray-600 mt-1">Detailed view of all site expenses</p>
          </div>
          
          <div className="p-6">
            {filteredExpenses && filteredExpenses.length > 0 ? (
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
                  {searchTerm || filterType !== 'all' ? 'No matching expenses found' : 'No expenses yet'}
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-8">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
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