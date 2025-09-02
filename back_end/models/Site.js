const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
  siteName : {
    type : String,
    required : true
  },
  location : {
    type : String,
    required : true
  },
  siteImage : {
    type : String,
    // required : true
  },
  manager : {
    type : mongoose.Schema.ObjectId,
    reg : "Manager"
  },
  isDeleted : {
    type: Boolean,
    default: false,
  }
},
{timestamps : true}
)

module.exports = mongoose.model("Site",siteSchema)