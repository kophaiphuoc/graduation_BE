const mongoose = require('mongoose');


const emailShecma = new mongoose.Schema({
    tokenOtp:{
        type:"String",
        required: true,
        unique: true
    },
    otpAcount:{
        type:"Number",
        required: true,
    },
    time:{
        type:Date,default:Date.now(),index:{expires:60}
    }
})
const emailOtp = mongoose.model("EmailOtp",emailShecma)
module.exports ={emailOtp}