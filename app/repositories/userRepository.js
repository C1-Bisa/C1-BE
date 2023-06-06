const { User } = require("../models");
const { verified } = require("../models");

module.exports = {

  findAll() {
    return User.findAll();
  },
  
  getTotalUser() {
    return User.count();
  },

  findEmail(email){
    return User.findOne({
      where : {email}
    })
  },

  findUser(id){
    return User.findOne({
      where: {id: id}
    })
  },

  create(createArgs){
    return User.create(createArgs);
  },

  deleteUser(id){
    return User.destroy({
      where : {id : id}
    });
  },

  updateUser(id, updateArgs){
    return User.update(updateArgs,{
      where : {id : id}
    });
  },

  createVerified(reqBody){
    return verified.create(reqBody)
  },

  findOtp(token){
    return verified.findOne({
      where: {verifiedToken: token}
    })
  },

  deleteOTP(id){
    return verified.destroy({
      where : {userId : id}
    });
  },
};
