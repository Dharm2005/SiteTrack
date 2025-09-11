import React, { useState } from 'react'
import { addMemo } from '../../services/memoService'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { addNewMemo } from '../../features/memoSlice'
import { StickyNote, Calendar, Type, X, AlertCircle } from 'lucide-react'

function AddMemoForm({ siteId, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    memoType: 'note',
    text: '',
    dueDate: '',
    siteId: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === 'text') {
      // Remove extra spaces
      processedValue = value.replace(/\s+/g, ' ');
    }

    setForm({
      ...form,
      [name]: processedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsSubmitting(true);

    try {
      const formData = new FormData()
      formData.append("memoType", form.memoType);
      formData.append("text", form.text.trim());
      formData.append("dueDate", form.dueDate);
      formData.append("siteId", siteId)

      const newMemo = await addMemo(formData);

      if (newMemo.success === false) {
        console.log("Validation errors", newMemo);
        if (newMemo.errors?.length) {
          newMemo.errors.forEach(err => {
            toast.error(`${err.field || err.path} : ${err.msg}`);
          })
        } else {
          toast.error(newMemo.message || "❌ Something went wrong")
        }
        return;
      }

      dispatch(addNewMemo(newMemo))
      toast.success("✅ New memo added successfully!");

      setForm({
        memoType: 'note',
        text: '',
        dueDate: '',
        siteId: ''
      });

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
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${form.memoType === 'note'
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
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${form.memoType === 'reminder'
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
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
            />
          </div>
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
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
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