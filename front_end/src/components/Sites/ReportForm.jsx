import React, { useState } from 'react'
import { Calendar, Download, FileText, AlertCircle, CheckCircle, X, Clock, BarChart3 } from 'lucide-react'
import { generatePDF } from '../../services/managerService';
import { toast } from 'react-toastify';

function ReportForm({ siteId, onClose }) {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    })
    // Clear error when user starts typing
    if (error) setError('')
    if (success) setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      const pdfBlob = await generatePDF(form.startDate, form.endDate, siteId);
      

      if (pdfBlob.success === false) {
        if (pdfBlob.errors && pdfBlob.errors.length > 0) {
          pdfBlob.errors.forEach(err => toast.error(err))
        }
        return;
      }

      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: 'application/pdf' })
      );

      const startDate = new Date(form.startDate).toLocaleDateString('en-GB').replace(/\//g, '-');
      const endDate = new Date(form.endDate).toLocaleDateString('en-GB').replace(/\//g, '-');
      const filename = `site-report-${startDate}-to-${endDate}.pdf`;

      // Option 1: Direct download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Option 2: Open in new tab (as fallback)
      if (!link.download) {
        window.open(url, '_blank');
      }

      // Cleanup
      document.body.removeChild(link);
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      setSuccess(true);

      // Auto close after successful download
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      console.error("Failed to download PDF", err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Generate Site Report</h3>
            <p className="text-sm text-gray-600">Create comprehensive site report for specified date range</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-purple-600 font-medium">Report Type</p>
                <p className="text-sm font-bold text-purple-900">Comprehensive</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Format</p>
                <p className="text-sm font-bold text-blue-900">PDF</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-medium">Download</p>
                <p className="text-sm font-bold text-green-900">Auto</p>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-pink-600" />
              <div>
                <p className="text-xs text-pink-600 font-medium">Est. Time</p>
                <p className="text-sm font-bold text-pink-900">~3s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Date Range *
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Date Range Summary */}
          {form.startDate && form.endDate && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                <strong>Report Period:</strong>
                <span className="ml-1">{formatDate(form.startDate)} to {formatDate(form.endDate)}</span>
                {(() => {
                  const days = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1
                  return <span className="ml-2 text-purple-600 font-medium">({days} day{days !== 1 ? 's' : ''})</span>
                })()}
              </p>
            </div>
          )}
        </div>

        {/* Quick Date Presets */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Quick Select:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Last 7 days', days: 7 },
              { label: 'Last 30 days', days: 30 },
              { label: 'Last 90 days', days: 90 },
              { label: 'This month', days: 'month' },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  const endDate = new Date();
                  let startDate = new Date();

                  if (preset.days === 'month') {
                    startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                  } else {
                    startDate.setDate(endDate.getDate() - preset.days + 1);
                  }

                  setForm({
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                  });
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm border-2 border-gray-300 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
            <p className="text-green-700 text-sm font-medium">Report generated successfully! Download started automatically.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          {/* Generate Report Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Generate & Download Report</span>
              </>
            )}
          </button>

          {/* Cancel Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Report Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            What's included in your report?
          </h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-800">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
              Site details and information
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
              Worker attendance records
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
              Expense breakdown and totals
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
              Notes and reminders log
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportForm