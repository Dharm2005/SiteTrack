import React, { useState } from "react";
import { Calendar, FileText, Clock, IndianRupee, Edit, Save, X, CalendarCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateAdvanceToDB } from "../../services/workerService";
import { updateAdvance } from "../../features/workerAdvanceSlice";
import { toast } from "react-toastify";

function Advance({ id, amount, date, note, createdAt, isSettled }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
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
      const res = await updateAdvanceToDB(id, form);

      if (res.errors) {
        console.log("Validation errors:", res.errors);
        res.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.msg}`);
        });
        return;
      }

      const advanceData = res.advance;
      dispatch(updateAdvance(advanceData));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating advance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`px-4 py-3 border-b ${isSettled ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-100'} transition-all duration-200`}>
      <div className="flex items-center justify-between space-x-8">

        {/* Amount Section */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${isSettled ? 'bg-gray-200' : 'bg-red-200'}`}>
            <IndianRupee className={`w-5 h-5 ${isSettled ? 'text-gray-500' : 'text-red-700'}`} />
          </div>
          <div>
            {isEditing ? (
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="text-lg font-semibold text-red-900 border border-red-300 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-300 px-3 py-1 rounded-lg w-28 h-9 bg-white"
              />
            ) : (
              <div className={`text-lg font-semibold ${isSettled ? 'text-gray-600' : 'text-red-800'} px-3 py-1 h-9 flex items-center w-28 bg-white rounded-lg`}>
                ₹{parseFloat(amount || 0).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Advance Date Section */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isSettled ? 'bg-gray-200' : 'bg-red-200'}`}>
            <CalendarCheck className={`w-4 h-4 ${isSettled ? 'text-gray-500' : 'text-red-700'}`} />
          </div>
          <div>
            {isEditing ? (
              <input
                type="date"
                name="date"
                value={form.date?.split("T")[0]}
                onChange={handleChange}
                className="border border-red-300 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-300 px-2 py-1 rounded-lg text-sm h-8 w-32 bg-white"
              />
            ) : (
              <div className={`font-medium ${isSettled ? 'text-gray-600' : 'text-red-800'} text-sm px-2 py-1 h-8 flex items-center w-32 bg-white rounded-lg`}>
                {formatDate(date)}
              </div>
            )}
            <div className={`text-xs ${isSettled ? 'text-gray-500' : 'text-red-600'} font-medium mt-1`}>ADVANCE DATE</div>
          </div>
        </div>

        {/* Note Section */}
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <FileText className={`w-4 h-4 ${isSettled ? 'text-gray-400' : 'text-red-600'} flex-shrink-0`} />
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full border border-red-300 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-200 px-3 py-1 rounded-lg text-sm h-8 bg-white"
                placeholder="Add advance note..."
              />
            ) : (
              <div className={`font-normal ${isSettled ? 'text-gray-700' : 'text-red-800'} truncate text-sm px-3 py-1 h-8 flex items-center w-full bg-white rounded-lg`} title={note || "No note"}>
                {note || <span className={`${isSettled ? 'text-gray-400' : 'text-red-400'} italic`}>No advance note</span>}
              </div>
            )}
          </div>
        </div>

        {/* Created At Section */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Clock className={`w-4 h-4 ${isSettled ? 'text-gray-600' : 'text-red-600'}`} />
          <div className="text-right">
            <div className={`font-medium ${isSettled ? 'text-gray-600' : 'text-red-700'} text-sm bg-white px-2 py-1 rounded-lg`}>{formatDate(createdAt)}</div>
            <div className={`text-xs ${isSettled ? 'text-gray-400' : 'text-red-600'} font-medium mt-1`}>Created {formatTime(createdAt)}</div>
          </div>
        </div>

        {user.role === 'manager' ? (<>
          {!isSettled ? (
            <div className="flex items-center space-x-1 flex-shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="p-2 bg-red-200 hover:bg-red-300 text-red-700 rounded-lg transition disabled:opacity-50"
                    title="Save Changes"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-red-200 hover:bg-red-300 text-red-700 rounded-lg transition"
                  title="Edit Advance"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (<></>)}
        </>) : (<></>)}
      </div>
    </div>
  );

}

export default Advance;
