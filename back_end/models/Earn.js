const mongoose = require('mongoose');

const earnSchema = new mongoose.Schema(
  {
    worker:{
      type : mongoose.Schema.Types.ObjectId,
      ref : "Worker",
      required : true
    },
    amount:{
      type : Number,
      required: true,
      min: 0,
    },
    date:{
      type: Date,
      required: true,
    },
    note:{
      type: String,
      trim: true,
    }
  },{timestamps : true}
)

module.exports = mongoose.model("Earn",earnSchema);