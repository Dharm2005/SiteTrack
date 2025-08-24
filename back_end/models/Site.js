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
  
},
{timestamps : true}
)

module.exports = mongoose.model("Site",siteSchema)