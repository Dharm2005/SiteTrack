import React, { useState } from 'react'
import { addMemo } from '../../services/memoService'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { addNewMemo } from '../../features/memoSliice'
import { StickyNote, Calendar, Type, X, AlertCircle } from 'lucide-react'

function AddMemoForm({ siteId, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    memoType: 'note',
    text: '',
    dueDate: '',
    siteId: '',
  })

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Text validation
    if (!form.text.trim()) {
      newErrors.text = 'Memo text is required';
    } else if (form.text.trim().length < 3) {
      newErrors.text = 'Memo text must be at least 3 characters';
    }

    // Due date validation for reminders
    if (form.memoType === 'reminder') {
      if (!form.dueDate) {
        newErrors.dueDate = 'Due date is required for reminders';
      } else {
        const selectedDate = new Date(form.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          newErrors.dueDate = 'Due date cannot be in the past';
        }
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear existing error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    let processedValue = value;
    
    if (name === 'text') {
      // Remove extra spaces
      processedValue = value.replace(/\s+/g, ' ');
    }

    setForm({
      ...form,
      [name]: processedValue
    });

    // Clear dueDate error if switching to note type
    if (name === 'memoType' && value === 'note' && errors.dueDate) {
      setErrors(prev => ({ ...prev, dueDate: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData()
      formData.append("memoType", form.memoType);
      formData.append("text", form.text.trim());
      formData.append("dueDate", form.dueDate);
      formData.append("siteId", siteId)

      const newMemo = await addMemo(formData);
      dispatch(addNewMemo(newMemo))
      toast.success("✅ New memo added successfully!");

      setForm({
        memoType: 'note',
        text: '',
        dueDate: '',
        siteId: ''
      });

      setErrors({});

      if (onClose) onClose();
    } catch (error) {
      console.log("error while adding memo", error);
      toast.error("❌ Failed to add memo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <StickyNote className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Memo</h3>
            <p className="text-sm text-gray-600">Create a note or reminder for this site</p>
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
        {/* Memo Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Memo Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, memoType: 'note', dueDate: '' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                form.memoType === 'note'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <StickyNote className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Note</div>
                  <div className="text-sm opacity-70">Simple note</div>
                </div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setForm({ ...form, memoType: 'reminder' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                form.memoType === 'reminder'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Reminder</div>
                  <div className="text-sm opacity-70">With due date</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Memo Text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Memo Text *
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              placeholder="Enter your memo text..."
              rows={4}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none ${
                errors.text ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-purple-500'
              }`}
            />
          </div>
          {errors.text && (
            <p className="text-red-500 text-sm mt-1">{errors.text}</p>
          )}
        </div>

        {/* Due Date - Only for reminders */}
        {form.memoType === 'reminder' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.dueDate ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isSubmitting ? 'Adding Memo...' : 'Add Memo'}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddMemoForm