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

  // 🔑 new fields
  username: {
    type: String,
    // required: true,
    unique: true
  },
  password: {
    type: String,
    // required: true
  },

  sites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site"
    }
  ]
}, { timestamps: true });


// ✅ Pre-save hook to auto-generate username + password
managerSchema.pre("save", async function (next) {
  if (this.isNew) {
    const baseName = this.managerName.replace(/\s+/g, "").toLowerCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.username = `${baseName}${randomNum}`;

    // Use the generated username as the first-time password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.username, salt);
  }
  next();
});

module.exports = mongoose.model("Manager", managerSchema);
