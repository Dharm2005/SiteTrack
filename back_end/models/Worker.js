const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  workerName: {
    type: String,
    required: true
  },
  workerImage: {
    type: String,
  },
  workerMobile: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Site"
  },
  isSettled: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Worker", workerSchema);
