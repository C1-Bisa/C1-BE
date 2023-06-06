const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const {sendMail, generateOTP} = require("../../utils/email");
require('dotenv').config()
const jwt = require("jsonwebtoken")
const {JWT_SIGNATURE_KEY} = process.env;


const encryptPassword = async (encryptedPassword) => {
  try{
    const password = await bcrypt.hash(encryptedPassword,10);
    return password;
  }catch(err){
    return err;
  }
}

const comparePassword = async (password, encryptedPassword) =>{
  try{
    const result = await bcrypt.compare(password,encryptedPassword);
    return result;
  }catch(err){
    return err;
  }
}

const createToken = (payload) => {
  return jwt.sign(payload,JWT_SIGNATURE_KEY, {expiresIn : '1800s'} );
}
const refreshToken = (payload) => {
  return jwt.sign(payload,JWT_SIGNATURE_KEY, {expiresIn : '5d'} );
}

module.exports = {

  async list() {
    try {
      const users = await userRepository.findAll();
      const userCount = await userRepository.getTotalUser();

      return {
        data: users,
        count: userCount,
      };
    } catch (err) {
      throw err;
    }
  },

  async login(requestBody){
    const {email,password} = requestBody;
    const user = await userRepository.finsUserByEmail(email);

    if(!user){
      return{
        isValid : false,
        message : "Email not found",
        data : null
      }
    }

    const isPasswordCorrect = await comparePassword(password, user.password)

    if(!isPasswordCorrect){
      return{
        isValid : false,
        message : "Password not corret",
        data : null
      }
    }

    const token = createToken({
      id: user.id, 
      email: user.email,
      nama: user.nama,
      role: user.role,
    })

    user.token = token;

    if(isPasswordCorrect){
      return{
        isValid : true,
        message : '',
        data : user
      }
    }

  },

  async create(reqBody) { 
    const nama = reqBody.name;
    const email = reqBody.email;
    const phone = reqBody.phone;
    const password = await encryptPassword(reqBody.password)
    const tokenOTP = generateOTP();
    const dateExpired = Date.now() + 60000;
    const dataRegis = {
      nama,
      email,
      password,
      phone,
      role: "User",
      isVerified: false,
    }

    if(!nama){
      return{
        data: null,
        message: "Name is required !!",
        status: "Failed"
      }
    }

    if(!email){
      return{
        data: null,
        message: "email is required !!",
        status: "Failed"
      }
    }

    if(!phone){
      return{
        data: null,
        message: "number phone is required !!",
        status: "Failed"
      }
    }

    if(!reqBody.password){
      return{
        data: null,
        message: "password is required",
        status: "Failed"
      }
    }

    if(reqBody.password.length <= 6){
      return{
        data: null,
        message: "password must fill with 6 character",
        status: "Failed"
      }
    }

    const userEmail = await userRepository.findEmail(email);

    if(userEmail){
      return{
        data: null,
        message: "Email has been taken !!",
        status: "Failed"
      }
    }
    const newUser = await userRepository.create(dataRegis);

    const verify = await userRepository.createVerified({
      userId: newUser.id,
      verifiedToken: tokenOTP,
      expiredDate: dateExpired,
    });
    
    sendMail(email, verify.verifiedToken);

    if(!userEmail){
      return{
        status: "Succes",
        data: newUser,
        message: "Tautan Verifikasi Telah Dikirim!",
        otp: verify.verifiedToken
      }
    }

  },

  async check(reqBody) {
    try {
      const OTPinput = reqBody.OTPinput;
    // find otp in database
    const OTPdatabase = await userRepository.findOtp(OTPinput);
    const newDate = Date.now();
    // the token will expired in 6 hours
    const limitExpired = OTPdatabase.expiredDate;
    

    if(limitExpired <= newDate){
      return{
        data: null,
        message: "OTP Code Expired, please resend OTP!",
        status: "Failed"
      }
    }

    const verif = {
      isVerified: true
    }
    const updateDataUser = await userRepository.updateUser(OTPdatabase.userId, verif)

    const createNotification = await userRepository.createNotif({
      headNotif: "Registrasion Success",
      message: "Proses verifikasi akun berhasil, order tiket pesawat sakpenakmu",
      userId: OTPdatabase.userId,
      isRead: false
    })

    return{
      subject: "Verification OTP",
      message: "Registrasi Berhasil",
      data: updateDataUser
    }
    } catch (error) {
      throw error
    }
  },

  async resendCode(reqBody) {
    try {
      const idUser = reqBody;
      const resetOTP = await userRepository.deleteOTP(idUser);
      const newTokenOTP = generateOTP();
      const newDateExpired = Date.now() + 60000;
      const userInfo = await userRepository.findUser(idUser);

      const verify = await userRepository.createVerified({
        userId: idUser,
        verifiedToken: newTokenOTP,
        expiredDate: newDateExpired,
      });
      
      sendMail(userInfo.email, verify.verifiedToken);

      return{
        data: {
          subject: "Resend OTP",
          message: "Tautan Verifikasi Telah Dikirim!",
          otp: verify.verifiedToken
        },
      }
    } catch (error) {
      throw error
    }

  },
  
};
