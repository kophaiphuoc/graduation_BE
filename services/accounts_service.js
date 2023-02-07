const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { emailOtp } = require('../models/emailotp_models');
const { Accounts } = require('../models/accounts_models');

const AccountService = {
  sendOtpEmail: async (email, name, otp) => {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "phuocph1903@gmail.com",
        pass: "kapgmspdigzrwrrd",
      },
    });

    const mailOptions = {
      from: "phuocph1903@gmail.com",
      to: email,
      subject: "Sending Email OTP",
      html: `<table border="0" cellpadding="0" cellspacing="0" class="background_main" style="font-family: Manrope ;background-color: #ffffff; padding-top: 20px; color: #434245; width: 100%; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; " width="100%">
            <tbody>
              <tr>
                <td style="font-size:6px; line-height:10px; padding:38.42px 0px 38.69px 0px;" valign="top" align="center">
                  <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="200" alt="" data-proportionally-constrained="true" data-responsive="false" src="https://uzin.store/img/light_logo.png" height="200">
          
                </td>
              </tr>
              <tr>
                <td align="center">
                  <div style="width: 329px;text-align: start;">
                      <span style="font-family: Manrope, Tahoma ;font-size: 18px;font-weight: 800;line-height: 25px;letter-spacing: 0em;text-align: left;color: #58595B;">
                          Hello ${name}!
                      </span>
                  </div>
                  <br>
                  <br>
                </td>
              </tr>
              <tr>
                <td align="center">
                 <div style="background: #F4F4F5; width:326.59px">
                   <img width="326.59px" src="http://cdn.mcauto-images-production.sendgrid.net/675279fac170805a/51462700-1858-42da-81fc-2f2d753fc769/654x358.png">
                 </div>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <div style="background: #F4F4F5; width:326.59px;">
                      <br>
                      <span style="font-family:  Manrope, Tahoma; font-size: 18px;font-weight: 800;line-height: 25px;letter-spacing: 0em;text-align: center;">OTP: ${otp} </span>
                      <br>
                      <br>
                      <span style="font-family:  Manrope, Tahoma;font-style: normal;font-weight: 400;font-size: 13px;line-height: 14px;text-align: center;color: #07213D; padding-left: 8px; padding-right: 8px;">Enter one time password (OTP) to proceed <br>
          with your Login.</span>
                      <br>
                      <br>
                  </div>
                </td>
              </tr>
          
              <tr>
                <td>
                  <div style="font-family: Manrope, Tahoma; text-align: center;padding-top: 45px;"><span style="font-size: 12px; ">Right-Hand
                      Cybersecurity is here to
                      support you against malicious cybercrimes.</span>
                  </div>
                  <br>
                  <br>
                </td>
              </tr>
          
              <tr>
                <td align="center">
                  <hr style="width: 326px; border: 1px solid #58595B; background: #58595B;">
                </td>
              </tr>
          
              <tr style="padding-top: 22px;">
                <td>
                  <div style="font-family: Manrope, Tahoma; text-align: center"><span style="font-size: 9px; ">Built by
                      Right-Hand
                      Cybersecurity.<br>
                      Have a lovely day!</span></div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 22px;">
                  <span>
                   <a href="https://www.facebook.com/profile.php?id=100010536793723"><img src="http://cdn.mcauto-images-production.sendgrid.net/675279fac170805a/28453ea0-6383-459d-a60d-81399f82f2b8/7x13.png"></a>
                   <a href="https://www.linkedin.com/in/h%E1%BB%AFu-ph%C6%B0%E1%BB%9Bc-ph%E1%BA%A1m-754a2b258/"><img src="http://cdn.mcauto-images-production.sendgrid.net/675279fac170805a/1f709a3c-6130-4752-8e89-7dd8c672e9b0/13x13.png"></a>
                  </span>
                  <br>
                  <br>
                  <br>
                  <br>
                </td>
              </tr>
          
            </tbody>
          </table>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
  createTokenOTP: async (formRegister) => {
    console.log(formRegister)
    const jwtotp = jwt.sign(
      {
        tokenotp: formRegister,
      },
      process.env.ACCESS_KEY,
      { expiresIn: "60s" }
    );

    const tokenOtp = new emailOtp({
      tokenOtp: jwtotp,
      otpAcount: formRegister.otpEmailAccount,
    });
    await tokenOtp.save();

  },
  sumbitOtpEmail: async (otp_req) => {
    try {
      const otp = await emailOtp.findOne({
        otpAcount: otp_req
      });

      var decoded = jwt.decode(otp.tokenOtp, { complete: true });
      const data = decoded.payload.tokenotp;
      const registerotp = async () => {
        const account = new Accounts({
          nameAccount: data.nameAccount,
          emailAccount: data.emailAccount,
          passWordAccount: data.passWordAccount,
          roleAccount: data.roleAccount,
        });
        await account.save();
      }

      if (otp == null) {
        return 0;
      } else {
        registerotp();
        return 1;
      }
    } catch (error) {
      console.log(error)
    }


  }
};
const AccountsLogin = {
  checkLogin: async (email, password) => {

    const emailAccount = await Accounts.findOne({ emailAccount: email });
    if (emailAccount == null) {
      return 0;
    } else {
      const checkPass = await bcrypt.compare(
        password,
        emailAccount.passWordAccount
      );
      if (checkPass == true) {
        const token = jwt.sign(
          {
            token: email,
          },
          process.env.ACCESS_KEY,
          { expiresIn: "24h" }
        );
        return token
      } else {
        return 0;
      }

    }
  }
};

module.exports = { AccountService, AccountsLogin };