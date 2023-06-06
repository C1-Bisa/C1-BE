const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const {sendMail, generateOTP} = require("../../utils/email");
require('dotenv').config()

const encryptPassword = async (password) => {
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  } catch (error) {
    
  }
}

const bcrypt = require("bcryptjs");
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



const {sendMail, generateOTP} = require("../../utils/email");
require('dotenv').config()

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
  return jwt.sign(payload,JWT_SIGNATURE_KEY, {expiresIn : '10s'} );
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

  // async create(reqBody) { 
  //   const name = reqBody.name;
  //   const email = reqBody.email;
  //   const noTelp = reqBody.noTelepon;

  // }
  
};
