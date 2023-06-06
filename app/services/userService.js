const userRepository = require("../repositories/userRepository");
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
      role: user.role
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
  
};
