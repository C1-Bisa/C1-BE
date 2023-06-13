const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const {sendMail, generateOTP} = require("../../utils/email");
require('dotenv').config()
const jwt = require("jsonwebtoken")
const {JWT_SIGNATURE_KEY} = process.env;
const{Notification, User} = require("../models");
const ApiError = require("../../utils/ApiError")

const regexGmail = /[\w]*@*[a-z]*\.*[\w]{5,}(\.)*(@gmail\.com)/g;


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
  return jwt.sign(payload,JWT_SIGNATURE_KEY,{ expiresIn: '3600s'} );
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

  async get(id) {
    return userRepository.find(id);
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

    const checkingEmail = email.match(regexGmail);
    if (!checkingEmail) {
      return{
        data: null,
        message: "Use gmail pattern for register Email!",
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

    const payloadNodemailer = {
      Email: email,
      subject: "OTP Code for Verification",
      html: `
      <h1 style="text-align:center;">Your Verification OTP Code</h1><br></br>
      <p style="margin-bottom:1.5rem; text-align:center;">
        Enter this verification code in field:
      </p><br></br>
      <p style="font-size:2rem; text-align:center; font-weight: 900; background:#000b76; border-radius: 0.5rem; padding:0.8rem; color:yellow;">${verify.verifiedToken}</p>
      <p style="text-align:center; margin-top:1.5rem">Verification code is valid only for 1 minutes</p>`
    }
    
    sendMail(payloadNodemailer);

    if(!userEmail){
      return{
        status: "Success",
        data: newUser,
        message: "Tautan Verifikasi Telah Dikirim!",
        otp: verify.verifiedToken
      }
    }

  },

  async update(req,res){
    const user = req.user
    const id = user.id
    const {
      nama,
      email,
      phone,
      password
    } = req.body;

    try{
      if (email) throw new ApiError(400, 'Email tidak boleh Diganti.');
      if (password) throw new ApiError(400, 'Password tidak boleh Diganti.');
      if (!nama) throw new ApiError(400, 'Nama tidak boleh kosong.');
      if (!phone) throw new ApiError(400, 'Nama tidak boleh kosong.');

      const updateUser = await userRepository.update(id,{nama,email,phone,password});
      res.status(200).json({
        status: "OK",
        message: "Success Updated Profile",
        data: updateUser
      });
      
    }catch(error){
      res.status(error.statusCode || 500).json({
        message: error.message,
      });
    }
  },

  async authorize (requestHeader) {
    try{
   // mendapatkan token 
    const bearerToken = requestHeader; 
    const token = bearerToken.split("Bearer ")[1];

    const tokenPayload = jwt.verify(token,JWT_SIGNATURE_KEY);

    return tokenPayload

    }catch{
      throw new Error('Failed to check and delete user');

    } 
  },

  async check(reqBody) {
    try {
      const OTPinput = reqBody.OTPinput;
    // find otp in database
    const OTPdatabase = await userRepository.findOtp(OTPinput);

    
    if(!OTPdatabase){
      return{
        data: null,
        message: "Wrong OTP code, please input again!",
        status: "Failed"
      }
    }

    if(OTPdatabase){
      const newDate = Date.now();
      // the token will expired in 1 minute
      const limitExpired = OTPdatabase.expiredDate;
      if(limitExpired <= newDate){
        return{
          data: null,
          message: "OTP Code Expired, please resend OTP!",
          status: "Failed"
        }
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

      if(!userInfo){
        return{
          data: null,
          message: "User Not found",
          status: "Failed"
        }
      }

      const verify = await userRepository.createVerified({
        userId: idUser,
        verifiedToken: newTokenOTP,
        expiredDate: newDateExpired,
      });

      const payloadNodemailer = {
        Email: userInfo.email,
        subject: "OTP Resend Code for Verification",
        html: `
        <h1 style="text-align:center;">Your Verification OTP Code</h1><br></br>
        <p style="margin-bottom:1.5rem; text-align:center;">
          Enter this verification code in field:
        </p><br></br>
        <p style="font-size:2rem; text-align:center; font-weight: 900; background:#000b76; border-radius: 0.5rem; padding:0.8rem; color:yellow;">${verify.verifiedToken}</p>
        <p style="text-align:center; margin-top:1.5rem">Verification code is valid only for 1 minutes</p>`
      }
      
      sendMail(payloadNodemailer);

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

  async reset(reqBody) {
    try {
      const emailReset = reqBody.email;
      const findEmail = await userRepository.findEmail(emailReset);

      if(!findEmail){
        return{
          data: null,
          message: "Email Not Registered!",
          status: "Failed"
        }
      }

      if(findEmail){
        const currentUrl = "http://localhost:3000";
        const tokenOTP = generateOTP();
        const dateExpired = Date.now() + 300000;
        const verify = await userRepository.createVerified({
          userId: findEmail.id,
          verifiedToken: tokenOTP,
          expiredDate: dateExpired,
        });
        const payloadNodemailer = {
          Email: findEmail.email,
          subject: "Reset Password Verification",
          html: `
          <h1 style="text-align:center;">Reset Password Confirmation Notification</h1><br></br>
          <p style="margin-bottom:1.5rem; text-align:center;">
            Enter this button verification code !!!
          </p><br></br>
          <a href="${currentUrl}/resetpage/${findEmail.id}/${verify.verifiedToken}" style="text-decoration:none; font-size:1rem; text-align:center; font-weight: 900; background:#000b76; border-radius: 0.5rem; color:yellow;">Confirm Reset</a>`
        }
        
        sendMail(payloadNodemailer);

        return{
          message: "Check your Email! Reset Password Link Has been send!",
          status: "Reset Password",
          otp: verify.verifiedToken
        }
      }

    } catch (error) {
      throw error
    }
  },

  async updatePass(reqParam, reqBody) {
    try {
      id = reqParam.id;
      token = reqParam.token;
      findToken = await userRepository.findOtp(token);

      if(!findToken){
        return{
          data: null,
          message: "Wrong token, token not found",
          status: "Failed"
        }
      }

      if(findToken.userId != id){
        return{
          data: null,
          message: "Token and user id not match",
          status: "Failed"
        }
      }

      if(findToken.userId == id){
        const newPassword = await encryptPassword(reqBody.newPassword)
        const newDate = Date.now();
        const getUser = await userRepository.findUser(id);
        // the token will expired in 5 minute
        const limitExpired = findToken.expiredDate;
        if(limitExpired <= newDate){
          deleteToken = await userRepository.deleteOTP(id);
          return{
            data: null,
            message: "Link reset password Expired",
            status: "Failed"
          }
        }

        const updatePassword = await userRepository.updateUser(getUser.id, {password: newPassword})
        deleteToken = await userRepository.deleteOTP(id);
        return{
          data: updatePassword,
          message: "User password Updated",
          status: "Success"
        }
      }

    } catch (error) {
      throw error
    }
  },
  
};
