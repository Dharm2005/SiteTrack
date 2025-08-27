import React, { useEffect, useState } from 'react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

function ExpenseChart({ siteId }) {
  // Get current month automatically
  const getCurrentMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }

  const [month, setMonth] = useState(getCurrentMonth())
  const [chartData, setChartData] = useState([])

  // Mock data for demonstration (replace with your actual service call)
  useEffect(() => {
    // Simulate API call with mock data
    const mockData = [
      { day: 1, spend: 12500 },
      { day: 3, spend: 8300 },
      { day: 5, spend: 15600 },
      { day: 8, spend: 22100 },
      { day: 12, spend: 9800 },
      { day: 15, spend: 18500 },
      { day: 18, spend: 14200 },
      { day: 21, spend: 25400 },
      { day: 24, spend: 11900 },
      { day: 27, spend: 17800 }
    ]
    setChartData(mockData)
  }, [siteId, month])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{`Day ${label}`}</p>
          <p className="text-blue-600 font-semibold text-lg">
            {`₹${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  const getMonthName = (monthStr) => {
    const [year, month] = monthStr.split("-")
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const totalExpense = chartData.reduce((sum, item) => sum + item.spend, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 h-full">
      <div className="grid grid-cols-12 gap-6 h-full">
        
        {/* Left Column - Month Selector and Total */}
        <div className="col-span-3 flex flex-col justify-center space-y-6">
          
          {/* Month Selector */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm"
            />
            <p className="text-sm text-gray-500 mt-2">{getMonthName(month)}</p>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-blue-900">
                ₹{totalExpense.toLocaleString()}
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>{chartData.length} days with expenses</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column - Chart */}
        <div className="col-span-9 flex flex-col">
          
          {/* Chart Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Daily Expense Trend</h3>
              <p className="text-sm text-gray-600">Expense pattern throughout the month</p>
            </div>
          </div>

          {/* Chart Container */}
          <div className="flex-1 bg-gray-50 rounded-lg p-4 min-h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#D1D5DB' }}
                    tickLine={{ stroke: '#D1D5DB' }}
                    label={{ value: 'Day of Month', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '12px', fill: '#6B7280' } }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#D1D5DB' }}
                    tickLine={{ stroke: '#D1D5DB' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#6B7280' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#expenseGradient)"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                  <p className="text-gray-500">No expenses found for {getMonthName(month)}</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
        
      </div>
    </div>
  )
}

export default ExpenseChart