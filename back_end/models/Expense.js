const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    expenseType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "cement",
        "sand",
        "diesel",
        "crushedStone",
        "steel",
        "vehicleBorrow",
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
    stoneType: [
      {
        type: String,
        enum: ["60mm", "40mm", "25mm", "10mm", "6mm", "Powder", "Wet mix", "GSB", "Other"]
      }
    ],
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
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
    },
    isDeleted : {
      type: Boolean,
      default: false
    },
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site", // link to your Site schema
      require: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
