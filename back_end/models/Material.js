// models/Material.js
const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
    trim: true,
  },
  billImage: {
    type: String, // store filename from multer
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    enum: ["kg", "ton", "piece", "bag", "litre", "meter", "other"], // you can extend
    default: "piece",
  },
  costPerUnit: {
    type: Number,
    min: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  purchasedDate: {
    type: Date,
    default: Date.now,
  },
  sites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",   // link to your Site schema
    },
  ],
});

// middleware to auto-calc totalCost
materialSchema.pre("save", function (next) {

  if (this.quantity && this.costPerUnit) {
    this.totalCost = this.quantity * this.costPerUnit;
  } 
  else if (this.quantity && this.totalCost) {
    this.costPerUnit = this.totalCost / this.quantity;
  } 
  else {
    return next(new Error("You must provide either (quantity + costPerUnit) or (quantity + totalCost)."));
  }

  next();
});

module.exports = mongoose.model("Material", materialSchema);
