const mongoose = require('mongoose');

const advanceSchema = new mongoose.Schema({
  worker:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true
  },
  amount:{
    type: Number,
    required: true,
    min: 0,
  },
  date:{
    type: Date,
    required: true,
    default: Date.now,
  },
  note:{
    type: String,
    trim: true
  },
},{timestamps : true})

module.exports = mongoose.model("Advance",advanceSchema);