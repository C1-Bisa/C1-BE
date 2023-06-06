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
        subject: "Testing Email",
        text: `token: ${token}`,
      };
  
      transporter.sendMail(options, (err, info)=>{
        if(err) console.error(err);
        console.log(`Email Has Been Send to : ${email}`);
      })
  }