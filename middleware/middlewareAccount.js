const jwt = require('jsonwebtoken');
const { emailOtp } = require('../models/emailotp_models');
const { Accounts } = require('../models/accounts_models');

const checkAccount ={
    checkRegister :async(req,res,next)=>{
        if(req.body.emailAccount == null || req.body.nameAccount == null || req.body.passWordAccount == null){
            res.status(400).json({message:"tài khoản đã tồn tại hoặc cú pháp không hợp lệ"})
        }else{
            const emailAccount = await Accounts.findOne({emailAccount: req.body.emailAccount});
            const nameAccount = await Accounts.findOne({nameAccount: req.body.nameAccount});
            
            if(emailAccount != null || nameAccount != null){
                res.status(400).json({message:"tài khoản đã tồn tại hoặc cú pháp không hợp lệ"});
            }else{
                next();
            }
            
        }
    }
}

module.exports = checkAccount;