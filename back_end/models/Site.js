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
  siteManagerName : {
    type : String,
    required : true
  },
  siteManagerContact : {
    type : String,
    required : true
  },

  // workers : [
  //   {
  //     type : mongoose.Schema.ObjectId,
  //     reg : "Worker"
  //   }
  // ],
  // manager : [
  //   {
  //     type : mongoose.Schema.ObjectId,
  //     reg : "Gallery"
  //   }
  // ],
  // materials : [
  //  {
  //     type : mongoose.Schema.ObjectId,
  //     reg : "Materials"
  //   }
  // ],

},
{timestamps : true}
)

module.exports = mongoose.model("Site",siteSchema)