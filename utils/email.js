const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator')
require('dotenv').config()

exports.generateOTP = () => {
    const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false });
    return OTP;
  }

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS,
    }
  })
  
exports.sendMail = (email, token) => {
      const options = {
        from: "'FlywUs' <no-reply@gmail.com>",
        to: email,
        subject: "OTP Code for Verification",
        html: `
        <h1 style="text-align:center;">Your Verification OTP Code</h1><br></br>
        <p style="margin-bottom:1.5rem; text-align:center;">
          Enter this verification code in field:
        </p><br></br>
        <p style="font-size:2rem; text-align:center; font-weight: 900; background:#000b76; border-radius: 0.5rem; padding:0.8rem; color:yellow;">${token}</p><br></br>
        <p style="text-align:center; margin-top:1.5rem">Verification code is valid only for 1 minutes</p>`
      };
  
      transporter.sendMail(options, (err, info)=>{
        if(err) console.error(err);
        console.log(`Email Has Been Send to : ${email}`);
      })
  }