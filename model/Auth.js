const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User_Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileno: {
    type: Number,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
  },
  date:{
    type: Date,
    default: Date.now()
  }
});

const User = mongoose.model("user", User_Schema);
module.exports = User;
