const { accounts_service, AccountsLogin } = require('../services/accounts_service');
const { Accounts } = require('../models/accounts_models');
const { emailOtp } = require('../models/emailotp_models');
const bcrypt = require("bcrypt");
const randomstring = require('randomstring');

const account_controllers = {
    sendOtpEmail: async (req, res) => {
        try {
            // tạo biến check trường trong model
            const allowedFields = Object.keys(Accounts.schema.paths);
            const requestFields = Object.keys(req.body);
            // check xem có trường nào không hợp lệ so với model
            const isValid = requestFields.every(field => allowedFields.includes(field));
            if (!isValid) {
                return res.status(400).json({ error: 'có trường không hợp lệ' });
            } else {
                const otp = randomstring.generate({
                    length: 6,
                    charset: 'numeric'
                });

                const formRegister = new Accounts({
                    nameAccount: req.body.nameAccount,
                    emailAccount: req.body.emailAccount,
                    passWordAccount: bcrypt.hashSync(req.body.passWordAccount, Number(process.env.SALTROUNDS)),
                    roleAccount: req.body.roleAccount == false,
                    otpEmailAccount: otp
                });
                //accounts_service.sendOtpEmail(formRegister.emailAccount, formRegister.nameAccount,otp)
                await accounts_service.createTokenOTP(formRegister);
                res.status(200).json({
                    message: 'Dữ liệu đã được nhận'
                });
            }

        } catch (error) {
            res.status(500).json({
                message: 'lấy dữ liệu thất bại'
            });
            console.log(error)
        }
    },
    checkOtpEmail: async (req, res) => {
        try {
            // tạo biến check trường trong model
            const allowedFields = Object.keys(emailOtp.schema.paths);
            const requestFields = Object.keys(req.body);
            // check xem có trường nào không hợp lệ so với model
            const isValid = requestFields.every(field => allowedFields.includes(field));

            if (!isValid) {
                return res.status(400).json({ error: 'có trường không hợp lệ' });
            } else {
                const a = await accounts_service.sumbitOtpEmail(req.body.otpAcount);

                if (a == 1) {
                    res.status(200).json({
                        message: "đăng ký thành công"
                    });
                } else {
                    res.status(404).json({
                        message: "mã OTP không hợp lệ"
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }

    }
}

const account_login_controllers = {
    checklogin: async (req, res) => {
        try {
            const email = req.body.emailAccount;
            const password = req.body.passWordAccount;

            const checklogin = await AccountsLogin.checkLogin(email, password);

            if (checklogin == 0) {
                res.status(404).json({
                    message: 'tài khoản hoặc mật khẩu không chính xác'
                });
            } else {
                res.status(200).json({
                    message: 'đăng nhập thành công',
                    token:checklogin
                })
            }
        } catch (error) {
            res.status(500).json({
                message: error
            });
        }

    }
}

module.exports = { account_controllers, account_login_controllers }