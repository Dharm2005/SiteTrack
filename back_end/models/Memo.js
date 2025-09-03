const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema({
  memoType: {
    type: String,
    required: true,
    enum: [
      "note",
      "reminder"
    ]
  },
  text: {
    type: String,
    required: true,
    trim : true
  },
  dueDate: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default : false
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Site",
    required : true
  }
}, { timestamps: true }
)

module.exports = mongoose.model("Memo",memoSchema);