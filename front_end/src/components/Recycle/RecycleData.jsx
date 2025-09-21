import React, { useState } from 'react'
import DeletedSites from './DeletedSites'
import DeletedManagers from './DeletedManagers';
import { useSelector } from 'react-redux';
import DeletedExpenses from './DeletedExpenses';
import DeletedWorkers from './DeletedWorkers';
import DeletedMemos from './DeletedMemos';

function RecycleData() {
  const { user } = useSelector((state) => state.auth);

  // Conditional default value based on user role
  const getDefaultPage = () => {
    if (user?.role === 'admin') {
      return 'sites';
    } else if (user?.role === 'manager') {
      return 'expenses';
    }
    return ''
  };

  const [selectedPage, setSelectedPage] = useState(getDefaultPage());

  return (
    <>
      <nav className="mb-6">
        <div className="flex items-center justify-between">
          {/* Navigation Tabs - Full Width */}
          <div className="flex w-full bg-gray-100 rounded-xl p-1 shadow-inner">
            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => setSelectedPage("sites")}
                  className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'sites'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Sites
                </button>
                <button
                  onClick={() => setSelectedPage("managers")}
                  className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'managers'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Managers
                </button>
              </>
            )}
            {user.role === 'manager' && (
              <>
                <button
                  onClick={() => setSelectedPage("expenses")}
                  className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'expenses'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setSelectedPage("workers")}
                  className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'workers'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Workers
                </button>
                <button
                  onClick={() => setSelectedPage("memos")}
                  className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${selectedPage === 'memos'
                    ? 'bg-white text-blue-600 shadow-md transform scale-[0.98] border border-blue-100'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  Memos
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div>
        {selectedPage === 'sites' && (
          <DeletedSites />
        )}
        {selectedPage === 'managers' && (
          <DeletedManagers />
        )}
        {selectedPage === 'expenses' && (
          <DeletedExpenses />
        )}
        {selectedPage === 'workers' && (
          <DeletedWorkers />
        )}
        {selectedPage === 'memos' && (
          <DeletedMemos />
        )}
      </div>
    </>
  )
}

export default RecycleData