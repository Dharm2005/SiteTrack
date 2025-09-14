import React, { useState } from 'react'
import { Calendar, Download, FileText, AlertCircle, CheckCircle, X, Clock, BarChart3 } from 'lucide-react'
import { generatePDF } from '../../services/managerService';

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

  const validateForm = () => {
    if (!form.startDate) {
      setError('Please select a start date')
      return false
    }
    if (!form.endDate) {
      setError('Please select an end date')
      return false
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      setError('Start date cannot be later than end date')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const pdfBlob = await generatePDF(form.startDate, form.endDate, siteId);
      
      // Create a blob URL
      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: 'application/pdf' })
      );
      
      // Create filename
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
    <div className="bg-white rounded-2xl shadow-lg border border-orange-200 mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-t-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-400 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Generate Site Report</h3>
              <p className="text-orange-100 text-sm">Create comprehensive site report for specified date range</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-orange-100 hover:text-white transition-colors p-1 hover:bg-orange-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Quick Info */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 truncate">Report Type</p>
                  <p className="text-sm font-bold text-gray-900">Comprehensive</p>
                </div>
              </div>
            </div>

            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 truncate">Format</p>
                  <p className="text-sm font-bold text-gray-900">PDF</p>
                </div>
              </div>
            </div>

            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 truncate">Download</p>
                  <p className="text-sm font-bold text-gray-900">Auto</p>
                </div>
              </div>
            </div>

            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 truncate">Est. Time</p>
                  <p className="text-sm font-bold text-gray-900">~30s</p>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range Section */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-4 h-4 text-orange-600" />
              <h4 className="font-semibold text-gray-900">Select Date Range</h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                  disabled={isLoading}
                />
                {form.startDate && (
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    From: {formatDate(form.startDate)}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                  disabled={isLoading}
                />
                {form.endDate && (
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    To: {formatDate(form.endDate)}
                  </p>
                )}
              </div>
            </div>

            {/* Date Range Summary */}
            {form.startDate && form.endDate && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <strong>Report Period:</strong> 
                  <span className="ml-1">{formatDate(form.startDate)} to {formatDate(form.endDate)}</span>
                  {(() => {
                    const days = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1
                    return <span className="ml-2 text-blue-600 font-medium">({days} day{days !== 1 ? 's' : ''})</span>
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Quick Date Presets */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center">
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
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white hover:border-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              <p className="text-green-700 text-sm font-medium">Report generated successfully! Download started automatically.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Generate Report Button */}
            <button
              type="submit"
              disabled={isLoading || !form.startDate || !form.endDate}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Report Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              What's included in your report?
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                Site details and information
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                Worker attendance records
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                Expense breakdown and totals
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                Notes and reminders log
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportForm
