import React from 'react'
import { Calendar, FileText, Clock, DollarSign } from 'lucide-react'

function Advance({ amount, date, note, createdAt }) {
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0">
      <div className="grid grid-cols-4 gap-6 items-center">
        {/* Amount Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full flex-shrink-0">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              ₹{parseFloat(amount || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Amount</div>
          </div>
        </div>

        {/* Date Section */}
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-900">{formatDate(date)}</div>
            <div className="text-xs text-gray-500">Advance Date</div>
          </div>
        </div>

        {/* Note Section */}
        <div className="flex items-center space-x-3">
          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate" title={note || 'No note'}>
              {note || 'No note provided'}
            </div>
            <div className="text-xs text-gray-500">Note</div>
          </div>
        </div>

        {/* Created At Section */}
        <div className="flex items-center space-x-3 justify-end">
          <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="text-right">
            <div className="font-medium text-gray-900">{formatDate(createdAt)}</div>
            <div className="text-xs text-gray-500">{formatTime(createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Advance