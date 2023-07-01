const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const {sendMail, generateOTP} = require("../../utils/email");
require('dotenv').config()
const jwt = require("jsonwebtoken")
const {JWT_SIGNATURE_KEY} = process.env;
const{Notification, User} = require("../models");
const ApiError = require("../../utils/ApiError");
const notificationRepository = require("../repositories/notificationRepository");

const regexGmail = /[\w]*@*[a-z]*\.*[\w]{5,}(\.)*(@gmail\.com)/g;


const encryptPassword = async (encryptedPassword) => {
  try{
    const password = await bcrypt.hash(encryptedPassword,10);
    return password;
  }catch(err){
    return err;
  }
} 

const encryptToken = async (token) => {
  try{
    const ecrypttoken = await bcrypt.hash(token,10);
    return ecrypttoken;
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
  return jwt.sign(payload,JWT_SIGNATURE_KEY,{ expiresIn: '172800s'} );
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

  async notification(request) {
    try {
      const id = request.user.id

      const notifUser = await notificationRepository.findAll(id);
      const countNotif = await notificationRepository.findNotifIsread(id);

      return{
        status : "Success",
        message : "Success get all notif user",
        data : notifUser,
        count: countNotif,
      }
    } catch (err) {
      throw err;
    }
  },

  async updateNotif(request) {
    try {
      const id = request.user.id

      const updateNotifUser = await notificationRepository.update(id, {isRead: true});

      return{
        status : "Success",
        message : "Success update isRead all notif user",
        data : updateNotifUser
      }
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

    const isPasswordCorrect = await comparePassword(password, user.password);
   

    if(!isPasswordCorrect){
      return{
        isValid : false,
        message : "Password not corret",
        data : null
      }
    }

    if(user.isVerified == false){
      return{
        isValid : false,
        message : "Akun tidak ditemukan",
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

    if(reqBody.password.length <= 8){
      return{
        data: null,
        message: "password must fill with 8 character",
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
      subject: "Email Verification",
      html: `
      <img style="margin-left: 15%; margin-right: 15%; width: 70%; height: 10rem; " src="https://i.imgur.com/JehRqwE.jpg"></img>
      <div style="text-align:center; border:1px; display: block; max-width: 900px;margin-left: 20%; margin-right: 20%;">
        <div style="text-align: left; margin: 0 auto; max-width: 600px;  color:black;">
            <h1 style="font-size: 24px; margin-top: 20px; ">Hello, ${nama}</h1>
            <p style="font-size: 16px; margin-top: 20px; margin-bottom: 20px;">
              Terimakasih telah menggunakan layanan kami. Masukkan kode OTP berikut untuk verifikasi akun anda. 
            </p>
            <div style="text-align: center; margin-bottom: 15px;">
                <a style="
                font-size:18px;
                text-align:center; 
                font-weight: 900; 
                background:#003D20; 
                border-radius: 10px; 
                padding:0.5rem; 
                color:white;
                border:none;
                ">${verify.verifiedToken}</a>
            </div>
            <p style="font-weight:700; margin-top:20px;">OTP akan kadaluwarsa dalam waktu 1 menit</p>
            <p>Abaikan email ini jika kamu tidak melakukan proses verifikasi</p>
            <p style="margin-top: 1.5px;">Thanks,<br> Tiketku team</p>
        </div>   
      </div>`
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
      if (!phone) throw new ApiError(400, 'Telepon tidak boleh kosong.');

      const updateUser = await userRepository.update(id,{nama,email,phone,password});
      if(updateUser){
        const getUser = await userRepository.findUser(id);
        res.status(200).json({
          status: "OK",
          message: "Success Updated Profile",
          data: {
            nama : getUser.nama,
            email: getUser.email,
            phone: getUser.phone
          }
        });
      }
    }catch(error){
      res.status(error.statusCode || 500).json({
        message: error.message,
      });
    }
  },

  async delete (userId) {
    try {
      // Hapus notifikasi terlebih dahulu
      await userRepository.deleteNotif(userId);

      // Hapus pengguna
      await userRepository.delete(userId)
  
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete user');
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
    } catch{
      throw new Error('Failed to verify OTP');
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
        <img style="margin-left: 15%; margin-right: 15%; width: 70%; height: 10rem; " src="https://i.imgur.com/JehRqwE.jpg"></img>
        <div style="text-align:center;  display: block; max-width: 900px;margin-left: 20%; margin-right: 20%;">
          <div style="text-align: left; margin: 0 auto; max-width: 600px; color:black;">
              <h1 style="font-size: 24px; margin-top: 20px; ">Hello, ${userInfo.nama}</h1>
              <p style="font-size: 16px; margin-top: 20px; margin-bottom: 20px;">
                Terimakasih telah menggunakan layanan kami. Masukkan kode OTP berikut untuk verifikasi akun anda. 
              </p>
              <div style="text-align: center; margin-bottom: 15px;">
                  <a style="
                  font-size:18px;
                  text-align:center; 
                  font-weight: 900; 
                  background:#003D20; 
                  border-radius: 10px; 
                  padding:0.5rem; 
                  color:white;
                  border:none;
                  ">${verify.verifiedToken}</a>
              </div>
              <p style="font-weight:700;">OTP akan kadaluwarsa dalam waktu 1 menit</p>
              <p>Abaikan email ini jika kamu tidak melakukan proses verifikasi</p>
              <p style="margin-top: 1.5px;">Thanks,<br> Tiketku team</p>
          </div>   
        </div>`
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
        const currentUrl = "https://c1-fe.vercel.app";
        const tokenOTP = generateOTP();
        const dateExpired = Date.now() + 300000;
        const tokenEncrypt = await encryptToken(tokenOTP);

        const addIdToken = `${tokenEncrypt}:${findEmail.id}`;
        

        const deleteToken = await userRepository.deleteOTP(findEmail.id);
        const verify = await userRepository.createVerified({
          userId: findEmail.id,
          verifiedToken: tokenOTP,
          expiredDate: dateExpired,
        });



        const payloadNodemailer = {
          Email: findEmail.email,
          subject: "Reset your password",
          html: `
          <img style="margin-left: 15%; margin-right: 15%; width: 70%; height: 10rem; " src="https://i.imgur.com/JehRqwE.jpg"></img>
          <div style="text-align:center;  display: block; max-width: 900px;margin-left: 20%; margin-right: 20%;">
            <div style="text-align: left; margin: 0 auto; max-width: 600px; color:black;">
                <h1 style="font-size: 24px; margin-top: 20px; ">Hello, ${emailReset}</h1>
                <p style="font-size: 16px; margin-top: 20px; margin-bottom: 20px;">
                  Terimakasih telah menggunakan layanan kami. Masukkan kode OTP berikut untuk verifikasi akun anda. 
                </p>
                <div style="text-align: center; margin-bottom: 20px;">
                    <a href="${currentUrl}/resetpage/?token=${addIdToken}" style="
                    font-size:18px;
                    text-align:center; 
                    font-weight: 900; 
                    background:#003D20; 
                    border-radius: 10px; 
                    padding:0.5rem; 
                    color:white;
                    border:none;
                    text-decoration: none;
                    ">Reset Your Password</a>
                </div>
                <p style="margin-top: 20px;">Abaikan email ini jika kamu tidak melakukan proses verifikasi</p>
                <p style="margin-top: 1.5px;">Thanks,<br> Tiketku team</p>
            </div>   
          </div>`
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

  async updatePass(reqQuery, reqBody) {
    try {
      const token = reqQuery.token;
      const newPasswords = reqBody.newPassword

      const splitToken = token.split(":");
      const id = splitToken[1];
      const tokenSplit = splitToken[0]

      // findToken = await userRepository.findOtp(token);
      const findData = await userRepository.findToken(id);
      const findToken = await comparePassword(findData.verifiedToken, tokenSplit)

      if(!findToken){
        return{
          data: null,
          message: "Wrong token, token not found",
          status: "Failed"
        }
      }

      // if(findToken.userId != id){
      //   return{
      //     data: null,
      //     message: "Token and user id not match",
      //     status: "Failed"
      //   }
      // }

      if(findToken){
        if(newPasswords.length <= 8){
          return{
            data: null,
            message: "password must fill with 8 character",
            status: "Failed"
          }
        }
        const newPassword = await encryptPassword(newPasswords)
        const newDate = Date.now();
        const getUser = await userRepository.findUser(id);
        // the token will expired in 5 minute
        const limitExpired = findData.expiredDate;
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
