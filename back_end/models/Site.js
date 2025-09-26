const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
  siteName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  siteImage: {
    type: String,
    // required : true
  },
  manager: {
    type: mongoose.Schema.ObjectId,
    reg: "Manager"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
},
  { timestamps: true }
)

module.exports = mongoose.model("Site", siteSchema)