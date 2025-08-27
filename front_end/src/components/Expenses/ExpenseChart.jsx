import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getFilteredExpenses } from "../../services/expenseService";

function ExpenseChart({ siteId }) {
  // Get current month automatically
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const [month, setMonth] = useState(getCurrentMonth());
  const [chartData, setChartData] = useState([]);

  // --- Get first and last day of selected month ---
  const getMonthRange = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const from = new Date(year, month - 1, 1); // first day
    const to = new Date(year, month, 0); // last day
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      const { from, to } = getMonthRange(month);
      const expenses = await getFilteredExpenses(siteId, from, to);

      // Group by day
      const dailyTotals = expenses.reduce((acc, exp) => {
        const day = new Date(exp.arrivalDate).getDate();
        acc[day] = (acc[day] || 0) + exp.totalCost;
        return acc;
      }, {});

      // Convert to array for Recharts
      const chartData = Object.entries(dailyTotals).map(([day, spend]) => ({
        day: Number(day),
        spend,
      }));

      // Sort by day
      chartData.sort((a, b) => a.day - b.day);

      setChartData(chartData);
    };

    fetchGraphData();
  }, [siteId, month]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{`Day ${label}`}</p>
          <p className="text-blue-600 font-semibold text-lg">
            {`₹${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const getMonthName = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const totalExpense = chartData.reduce((sum, item) => sum + item.spend, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="grid grid-cols-12 h-full">
        
        {/* Left Side: Month Selector + Total Expenses stacked */}
        <div className="col-span-3 border-r p-6 flex flex-col justify-between">
          {/* Month Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-1">{getMonthName(month)}</p>
          </div>

          {/* Total Expenses Box */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-center">
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                Total Expenses
              </p>
              <p className="text-xl font-bold text-blue-900">
                ₹{totalExpense.toLocaleString()}
              </p>
              <div className="flex items-center justify-center space-x-1 text-xs text-blue-600 mt-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>{chartData.length} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chart */}
        <div className="col-span-9 p-6 flex flex-col">
          {/* Chart Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Daily Expense Trend
            </h3>
            <p className="text-sm text-gray-600">
              Expense pattern throughout the month
            </p>
          </div>

          {/* Chart */}
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="expenseGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3B82F6"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={{ stroke: "#D1D5DB" }}
                    tickLine={{ stroke: "#D1D5DB" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={{ stroke: "#D1D5DB" }}
                    tickLine={{ stroke: "#D1D5DB" }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#expenseGradient)"
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                    activeDot={{
                      r: 5,
                      stroke: "#3B82F6",
                      strokeWidth: 2,
                      fill: "#FFFFFF",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    No Data Available
                  </h3>
                  <p className="text-sm text-gray-500">
                    No expenses found for {getMonthName(month)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseChart;
