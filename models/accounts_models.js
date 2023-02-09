const mongoose = require('mongoose');

const accountShacma = new mongoose.Schema({
    nameAccount: {
        type:'String',
        required: true,
        unique: true
    },
    emailAccount:{
        type: 'string',
        required: true,
        unique: true
    },
    passWordAccount: {
        type: 'string',
        required: true,
    },
    roleAccount:{
        type:Boolean,
    },
    otpEmailAccount:{
        type:'Number'
    }
});

const Accounts = mongoose.model('Accounts',accountShacma);
module.exports = {Accounts}