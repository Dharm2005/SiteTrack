import React, { useEffect, useState } from 'react'
import { getDeletedExpenses } from '../../services/recycleService'
import DeletedExpense from './DeletedExpense'

function DeletedExpenses({ siteId }) {
  const [deletedExpenses, setDeletedExpenses] = useState()

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const deletedExpenses = await getDeletedExpenses(siteId);
        console.log(deletedExpenses);
        setDeletedExpenses(deletedExpenses)
      } catch (error) {
        console.error("Error while fetching deleted expenses", error);
        setDeletedExpenses([]); // Set empty array on error
      }
    }
    fetchExpenses()
  }, [siteId])

  const handleStateChange = (id) => {
    setDeletedExpenses(prev => prev.filter(expense => expense._id !== id))
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {deletedExpenses && deletedExpenses.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header with perfect alignment for expenses */}
            <div className="grid grid-cols-17 gap-2 p-4 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
              <div className="col-span-3 flex items-center pl-14">
                <span className="font-semibold text-gray-700 text-sm">Expense Type</span>
              </div>
              <div className="col-span-2 flex items-center pl-8">
                <span className="font-semibold text-gray-700 text-sm">Stone Type</span>
              </div>
              <div className="col-span-2 flex items-center pl-7">
                <span className="font-semibold text-gray-700 text-sm">Supplier Name</span>
              </div>
              <div className="col-span-2 flex items-center pl-14">
                <span className="font-semibold text-gray-700 text-sm">Quantity</span>
              </div>
              <div className="col-span-2 flex items-center pl-18">
                <span className="font-semibold text-gray-700 text-sm">Detail</span>
              </div>
              <div className="col-span-2 flex items-center pl-20">
                <span className="font-semibold text-gray-700 text-sm">Cost</span>
              </div>
              <div className="col-span-2 flex items-center pl-17">
                <span className="font-semibold text-gray-700 text-sm">Dates</span>
              </div>
              <div className="col-span-2 flex items-center pl-2">
                <span className="font-semibold text-gray-700 text-sm">Vehicle Number</span>
              </div>
            </div>

            {/* Data rows */}
            <div>
              {deletedExpenses.map(expense => (
                <DeletedExpense
                  key={expense._id}
                  id={expense._id}
                  expenseType={expense.expenseType}
                  stoneType={expense.stoneType}
                  billImage={expense.billImage}
                  quantity={expense.quantity}
                  unit={expense.unit}
                  totalCost={expense.totalCost}
                  arrivalDate={expense.arrivalDate}
                  vehicleNumber={expense.vehicleNumber}
                  supplierName={expense.supplierName}
                  details={expense.details}
                  deletedAt={expense.deletedAt}
                  onStateChange={handleStateChange}
                />
              ))}
            </div>
          </div>
        ) : deletedExpenses && deletedExpenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted expenses</h3>
            <p className="text-gray-500">Your expense recycle bin is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading deleted expenses...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeletedExpenses