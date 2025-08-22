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
  workerAdvance: { 
    type: Number, 
    default: 0 
  },
  workerPerDiem: { 
    type: Number, 
    required: true 
  }, 
  sites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Worker", workerSchema);
