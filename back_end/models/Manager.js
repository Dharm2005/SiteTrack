const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // for hashing password

const managerSchema = new mongoose.Schema({
  managerName: {
    type: String,
    required: true
  },
  managerImage: {
    type: String,
  },
  managerMobile: {
    type: String,
    required: true,
    unique: true
  },
  managerDob: {
    type: Date,
    required: true
  },
  managerGender: {
    type: String,
    required: true,
    enum: ["male", "female"],
    default: "male",
  },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site"
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Manager", managerSchema);