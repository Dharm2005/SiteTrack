// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    expenseType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "cement",
        "soil",
        "petrol",
        "diesel",
        "iron",
        "vehicleBorrow",
        "small",
        "other",
      ], // flexible categories
    },
    billImage: {
      type: String, // store filename from multer
      default: null,
    },
    quantity: {
      type: Number,
      min: 0,
    },
    unit: {
      type: String,
      enum: ["kg", "ton", "piece", "bag", "litre", "meter", "other"],
      default: "other",
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    arrivalDate: {
      type: Date,
      default: Date.now,
    },
    vehicleNumber: {
      type: String,
      default: null, // optional
    },
    sites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Site", // link to your Site schema
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
