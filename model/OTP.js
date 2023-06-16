const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Otp_Schema = new Schema({
    Otp:{
        type: Number
    },
    query:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 1*86400
    }
})

const OTP = mongoose.model("otp", Otp_Schema);
module.exports = OTP;