import React from 'react'
import AddExpenseForm from './AddExpenseForm'
import { useSelector } from 'react-redux'
import { Expense } from '../index'
import { useState } from 'react'
import { Plus, Users, Package } from 'lucide-react'

function Expenses({siteId}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const allExpenses = useSelector((state) => state.expense.expenses);
  console.log(allExpenses);
    

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
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
            <p className="text-gray-600">
              {allExpenses?.length ? `${allExpenses.length} expenses found` : 'No expenses available'}
            </p>
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

      {showAddForm && (
        <AddExpenseForm 
          siteId={siteId}
          onClose={handleCloseForm}
        />
      )}

      {allExpenses && allExpenses.length > 0 ? (
        <div className="grid gap-4">
          {allExpenses.map(expense => (
            <div key={expense._id}>
              <Expense
                key={expense._id}
                id={expense._id}
                name={expense.materialName}
                billImage={expense.billImage}
                quantity={expense.quantity}
                unit={expense.unit}
                costPerUnit={expense.costPerUnit}
                totalCost={expense.totalCost}
                purchasedDate={expense.purchasedDate}
                sellerName={expense.sellerName}
                vahicleNumber={expense.vahicleNumber}
                createdAt={expense.createdAt}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No expenses found</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            There are no expenses listed to this site yet. Add your first expense to get started.
          </p>
          {!showAddForm && (
            <button
              onClick={handleShowForm}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add First expense</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Expenses
