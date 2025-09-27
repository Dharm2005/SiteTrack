import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addEarnOfWorker } from '../../services/workerService'
import { addNewEarn } from '../../features/workerEarnSlice'
import { X, DollarSign, Calendar, FileText, Plus } from 'lucide-react'
import { toast } from 'react-toastify'

function AddEarnForm({ workerId, onClose }) {
  const [form, setFrom] = useState({
    worker: '',
    amount: '',
    date: '',
    note: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFrom((prevVal) => (
      { ...prevVal, [name]: value }
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("worker", workerId);
      formData.append("amount", form.amount);
      formData.append("date", form.date);
      formData.append("note", form.note);

      const res = await addEarnOfWorker(formData);

      if (res.success === false) {
        console.log("Validation errors:", res.errors);
        if (res.errors && res.errors.length > 0) {
          res.errors.forEach(err => {
            toast.error(`${err.field}: ${err.msg}`); // use "path" from backend
          });
        } else if (res.message) {
          toast.error(res.message || "Something went wrong");
        }
        return; // stop execution if validation failed
      }

      const earnData = res.earning;
      dispatch(addNewEarn(earnData))

      setFrom({
        amount: '',
        date: '',
        note: ''
      })

      // Close form after successful submission
      if (onClose) onClose();

    } catch (error) {
      console.log("Error while adding new earn", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = () => {
    setFrom({
      amount: '',
      date: '',
      note: ''
    });
    if (onClose) onClose();
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Plus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Earning</h3>
            <p className="text-sm text-gray-600">Record a new earned payment for this worker</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              <span>Amount</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₹
              </span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              <span>Date</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Note Field */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4" />
            <span>Note</span>
          </label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Add a note about this advance (optional)"
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-3 border-t border-gray-100">
          {onClose && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Earning</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEarnForm