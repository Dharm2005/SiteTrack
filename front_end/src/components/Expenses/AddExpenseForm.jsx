import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addExpens, updateExpenseToDB } from '../../services/expenseService'
import { toast } from 'react-toastify';
import { addNewExpense, updateExpense } from '../../features/expenseSlice';
import { Package, Upload, X, IndianRupee, Calendar, Truck, Hash, Scale, Tag, FileText, User, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:3000";

function AddExpenseForm({ siteId, onClose, initialValues }) {
  console.log(siteId);

  // Determine if we're in edit mode
  const isEditMode = !!initialValues;

  const [form, setForm] = useState(initialValues || {
    type: 'expense',
    expenseType: 'other',
    stoneType: '',
    billImage: null,
    quantity: 0,
    unit: 'other',
    totalCost: 0,
    arrivalDate: '',
    vehicleNumber: '',
    supplierName: '',
    details: '',
    siteId: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [stoneTypes, setStoneTypes] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const expenseTypeOptions = [
    { value: "cement", label: "Cement" },
    { value: "sand", label: "Sand" },
    { value: "crushedStone", label: "Crushed Stone" },
    { value: "diesel", label: "Diesel" },
    { value: "steel", label: "Steel" },
    { value: "vehicleBorrow", label: "Vehicle Borrow" },
    { value: "other", label: "Other" }
  ];

  const unitOptions = ["kg", "ton", "piece", "bag", "litre", "other"];

  const stoneTypeOptions = [
    { value: "60mm", label: "60mm" },
    { value: "40mm", label: "40mm" },
    { value: "25mm", label: "25mm" },
    { value: "10mm", label: "10mm" },
    { value: "6mm", label: "6mm" },
    { value: "Powder", label: "Powder" },
    { value: "Wet mix", label: "Wet Mix" },
    { value: "GSB", label: "GSB" },
    { value: "Other", label: "Other" }
  ];

  // Check if unit is required based on expense type
  const isUnitRequired = () => {
    return !['vehicleBorrow', 'other'].includes(form.expenseType);
  };

  // Check if supplier name should be visible (materials and vehicle expenses)
  const isSupplierRequired = () => {
    return !['other', 'diesel'].includes(form.expenseType);
  };

  // Get allowed units based on expense type
  const getAllowedUnits = () => {
    if (form.expenseType === 'petrol' || form.expenseType === 'diesel') {
      return ['litre'];
    }
    return unitOptions;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      setForm({ ...form, [name]: file });

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      let processedValue = value;

      // Handle different input types
      if (type === "number") {
        processedValue = value === '' ? 0 : Number(value);
      } else if (name === 'vehicleNumber') {
        // Convert to uppercase and remove extra spaces
        processedValue = value.replace(/\s+/g, ' ').toUpperCase().trim();
      } else if (name === 'supplierName') {
        // Trim supplier name and capitalize first letter of each word
        processedValue = value.replace(/\s+/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
      }

      let updatedForm = {
        ...form,
        [name]: processedValue
      };

      // Handle expense type changes
      if (name === 'expenseType') {
        if (['vehicleBorrow', 'other'].includes(processedValue)) {
          // Reset unit and quantity when expense type changes to vehicleBorrow or other
          updatedForm = {
            ...updatedForm,
            unit: 'other',
            quantity: 0
          };
        } else if (processedValue === 'petrol' || processedValue === 'diesel') {
          // Automatically set unit to litre for petrol/diesel
          updatedForm = {
            ...updatedForm,
            unit: 'litre'
          };
        }

        // Reset stone types when expense type changes
        if (processedValue !== 'crushedStone') {
          setStoneTypes([]);
        }

        // Clear supplier name when expense type changes to other/diesel
        if (['other', 'diesel'].includes(processedValue)) {
          updatedForm = {
            ...updatedForm,
            supplierName: ''
          };
        }
      }

      setForm(updatedForm);
    }
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setStoneTypes(prev => [...prev, value])
    }
    else {
      setStoneTypes(prev => prev.filter((t) => t !== value))
    }
  }

  useEffect(() => {
    if (initialValues) {
      setForm({
        type: 'expense',
        expenseType: initialValues.expenseType,
        stoneType: initialValues.stoneType,
        billImage: null,
        quantity: initialValues.quantity,
        unit: initialValues.unit,
        totalCost: initialValues.totalCost,
        arrivalDate: initialValues.arrivalDate
          ? new Date(initialValues.arrivalDate).toISOString().split("T")[0]
          : '',
        vehicleNumber: initialValues.vehicleNumber,
        supplierName: initialValues.supplierName,
        details: initialValues.details,
        siteId: initialValues.siteId,
      })

      // Set stone types for editing crushed stone expenses
      if (initialValues.stoneType && Array.isArray(initialValues.stoneType)) {
        setStoneTypes(initialValues.stoneType);
      }
    }

    if (initialValues && initialValues.billImage) {
      const imageUrl = `${API_URL}/uploads/bills/${initialValues.billImage}`
      setImagePreview(imageUrl)
    }

  }, [initialValues])

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", "expense");
      formData.append("expenseType", form.expenseType);
      if (form.billImage instanceof File) {
        formData.append("billImage", form.billImage);
      }

      // Only append quantity and unit if they are relevant for the expense type
      if (isUnitRequired()) {
        formData.append("quantity", form.quantity);
        formData.append("unit", form.unit);
      } else {
        // For vehicleBorrow and other, set default values
        formData.append("quantity", 0);
        formData.append("unit", "other");
      }
      if (form.expenseType === 'crushedStone') {
        formData.append("stoneType", JSON.stringify(stoneTypes));
      } else {
        formData.append("stoneType", JSON.stringify([]));
      }
      formData.append("totalCost", form.totalCost);
      formData.append("arrivalDate", form.arrivalDate);
      formData.append("vehicleNumber", form.vehicleNumber.trim());
      formData.append("supplierName", form.supplierName.trim());
      formData.append("details", form.details)
      if (!initialValues && siteId) {
        formData.append("siteId", siteId);
      }

      console.log(formData);
      

      let res;

      if (initialValues) {
        formData.append("_id", initialValues._id)
        res = await updateExpenseToDB(initialValues._id, formData)
      } else {
        res = await addExpens(formData);
      }

      if (res.success === false) {
        console.log("Validation/Server error:", res);
        if (res.errors?.length) {
          res.errors.forEach(err => {
            toast.error(`${err.field}: ${err.msg}`);
          });
        } else {
          toast.error(res.message || "❌ Something went wrong");
        }
        return; // stop execution
      }

      const expenseData = res.expense;
      if (initialValues) {
        dispatch(updateExpense(expenseData))
        toast.success("✅ Expense updated successfully!");
        navigate(`/site/${siteId}/expenses`)
      } else {

        dispatch(addNewExpense(expenseData));
        toast.success("✅ New expense added successfully!");
        // Reset form
        setForm({
          expenseType: 'other',
          stoneType: '',
          billImage: null,
          quantity: 0,
          unit: 'other',
          totalCost: 0,
          arrivalDate: '',
          vehicleNumber: '',
          supplierName: '',
          details: '',
          siteId: '',
        });
        setStoneTypes([]);
        setImagePreview(null);
      }

      if (onClose) onClose();
    } catch (error) {
      console.error(`error while ${isEditMode ? 'updating' : 'adding new'} expense`, error);
      toast.error(`❌ Failed to ${isEditMode ? 'update' : 'add'} expense. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, billImage: null });
    setImagePreview(null);
  };

  // Get today's date in YYYY-MM-DD format for max date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const allowedUnits = getAllowedUnits();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 ${isEditMode ? 'bg-blue-100' : 'bg-green-100'} rounded-md`}>
            {isEditMode ? (
              <Edit className="w-4 h-4 text-blue-600" />
            ) : (
              <Package className="w-4 h-4 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditMode ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <p className="text-xs text-gray-500">
              {isEditMode ? 'Update the expense details below' : 'Fill in the expense details'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Row: Expense Type, Total Cost, Arrival Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Type
            </label>
            <div className="relative">
              <Tag className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="expenseType"
                value={form.expenseType}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                {expenseTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Cost (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="totalCost"
                value={form.totalCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter total cost"
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="arrivalDate"
                value={form.arrivalDate}
                onChange={handleChange}
                max={getTodayDate()}
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Stone Types - Only visible for crushed stone */}
        {form.expenseType === 'crushedStone' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stone Types
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {stoneTypeOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={stoneTypes.includes(option.value)}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {stoneTypes.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-green-600">
                  Selected: {stoneTypes.map(type => stoneTypeOptions.find(opt => opt.value === type)?.label).join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Second Row: Quantity, Unit, Vehicle Number (Conditional quantity and unit) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {isUnitRequired() ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="relative">
                  <Hash className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter quantity"
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                  {(form.expenseType === 'petrol' || form.expenseType === 'diesel') && (
                    <span className="text-blue-600 text-xs ml-1">(Auto-set to Litre)</span>
                  )}
                </label>
                <div className="relative">
                  <Scale className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    disabled={form.expenseType === 'petrol' || form.expenseType === 'diesel'}
                    className={`w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${(form.expenseType === 'petrol' || form.expenseType === 'diesel') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    {allowedUnits.map(unit => (
                      <option key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="md:col-span-2"></div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number
            </label>
            <div className="relative">
              <Truck className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                placeholder="Enter vehicle number"
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Supplier Name Field - Only visible for material and vehicle expenses */}
        {isSupplierRequired() && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name
            </label>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="supplierName"
                value={form.supplierName}
                onChange={handleChange}
                placeholder="Enter supplier name"
                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}

        {/* Details Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details
          </label>
          <div className="relative">
            <FileText className="absolute left-2.5 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              placeholder="Enter any additional details (optional)"
              rows="3"
              className="w-full pl-8 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm border-gray-300 resize-none"
            />
          </div>
        </div>

        {/* Bill Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bill/Receipt Photo
          </label>

          {!imagePreview ? (
            <div className="relative">
              <input
                type="file"
                name="billImage"
                onChange={handleChange}
                accept="image/*"
                className="hidden"
                id="billImageInput"
              />
              <label
                htmlFor="billImageInput"
                className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <p className="text-sm text-gray-600">
                  {isEditMode ? 'Update bill/receipt' : 'Upload bill/receipt'}
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Bill preview"
                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Info Notes */}
        {!isUnitRequired() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <p className="text-sm text-blue-700">
                For <strong>{expenseTypeOptions.find(opt => opt.value === form.expenseType)?.label}</strong> expenses,
                quantity and unit fields are optional.
              </p>
            </div>
          </div>
        )}

        {(form.expenseType === 'petrol' || form.expenseType === 'diesel') && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-amber-700">
                For <strong>{form.expenseType}</strong> expenses, the unit is automatically set to <strong>litre</strong> and cannot be changed.
              </p>
            </div>
          </div>
        )}

        {form.expenseType === 'crushedStone' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-sm text-green-700">
                For <strong>Crushed Stone</strong> expenses, please select at least one stone type from the options above.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 ${isEditMode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              } text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
          >
            {isSubmitting
              ? (isEditMode ? 'Updating...' : 'Adding...')
              : (isEditMode ? 'Update Expense' : 'Add Expense')
            }
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddExpenseForm