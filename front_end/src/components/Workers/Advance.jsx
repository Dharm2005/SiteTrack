import React, { useState } from "react";
import { Calendar, FileText, Clock, DollarSign, Edit, Save, X, CalendarCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateAdvanceToDB } from "../../services/workerService";
import { updateAdvance } from "../../features/workerAdvanceSlice";

function Advance({ id, amount, date, note, createdAt, isSettled }) {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    amount,
    date,
    note,
  });
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedAdvance = await updateAdvanceToDB(id, form);
      dispatch(updateAdvance(updatedAdvance));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating advance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center justify-between space-x-8">

        {/* Amount Section */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className={`flex items-center justify-center w-10 h-10 ${isSettled ? 'bg-gray-200' : 'bg-green-100'} rounded-full`}>
            <DollarSign className={`w-5 h-5 ${isSettled ? 'text-gray-500' : 'text-green-600'}`} />
          </div>
          <div>
            {isEditing ? (
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="text-lg font-bold text-gray-900 border-2 border-green-200 focus:border-green-400 focus:outline-none px-2 py-1 rounded w-28 h-9"
              />
            ) : (
              <div className="text-lg font-bold text-gray-900 px-2 py-1 h-9 flex items-center w-28">
                ₹{parseFloat(amount || 0).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Advance Date Section - with blue accent */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className={`flex items-center justify-center w-8 h-8 ${isSettled ? 'bg-gray-200' : 'bg-blue-100'} rounded-full`}>
            <CalendarCheck className={`w-4 h-4 ${isSettled ? 'text-gray-500' : 'text-blue-600'}`} />
          </div>
          <div>
            {isEditing ? (
              <input
                type="date"
                name="date"
                value={form.date?.split("T")[0]}
                onChange={handleChange}
                className="border-2 border-blue-200 focus:border-blue-400 focus:outline-none px-2 py-1 rounded text-sm h-8 w-32"
              />
            ) : (
              <div className="font-medium text-blue-900 text-sm px-2 py-1 h-8 flex items-center w-32">
                {formatDate(date)}
              </div>
            )}
            <div className={`text-xs ${isSettled ? 'text-gray-500' : 'text-blue-600'} font-medium mt-1`}>Advance Date</div>
          </div>
        </div>

        {/* Note Section */}
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 focus:border-gray-400 focus:outline-none px-2 py-1 rounded text-sm h-8"
                placeholder="Add note..."
              />
            ) : (
              <div className="font-medium text-gray-900 truncate text-sm px-2 py-1 h-8 flex items-center w-full" title={note || "No note"}>
                {note || <span className="text-gray-400 italic">No note</span>}
              </div>
            )}
          </div>
        </div>

        {/* Created At Section - with subtle styling */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Clock className="w-4 h-4 text-gray-400" />
          <div className="text-right">
            <div className="font-medium text-gray-700 text-sm">{formatDate(createdAt)}</div>
            <div className="text-xs text-gray-400">Created {formatTime(createdAt)}</div>
          </div>
        </div>

        {!isSettled ? (
          <div className="flex items-center space-x-1 flex-shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  title="Save Changes"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors duration-200"
                title="Edit Advance"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (<></>)}
      </div>
    </div>
  );
}

export default Advance;