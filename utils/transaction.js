const otpGenerator = require('otp-generator')

exports.generateCode = () => {
    const OTP = otpGenerator.generate(10, { digits: true, upperCaseAlphabets: true, specialChars: false, lowerCaseAlphabets:false});
    return OTP;
  }