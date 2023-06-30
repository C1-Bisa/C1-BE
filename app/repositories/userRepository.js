const { User } = require("../models");
const { verified } = require("../models");
const {Notification} = require("../models");

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
      where: {id}
    })
  },

  create(createArgs){
    return User.create(createArgs);
  },

  update(id, updateArgs) {
    return User.update(updateArgs, {
      where: {
        id,
      },
    });
  },

  delete(id) {
    return User.destroy({ 
      where: { 
        id 
      }
    });
  },

  updateUser(id, updateArgs){
    return User.update(updateArgs,{
      where : {id : id}
    });
  },

  createNotif(createnotifArgs){
    return Notification.create(createnotifArgs);
  },


  deleteNotif(userId){
    return Notification.destroy({
      where: {
        userId: userId 
      }
    })
  },

  createVerified(reqBody){
    return verified.create(reqBody)
  },


  findOtp(token){
    return verified.findOne({
      where: {verifiedToken: token}
    })
  },

  findToken(id){
    return verified.findOne({
      where: {userId: id}
    })
  },

  deleteOTP(id){
    return verified.destroy({
      where : {userId : id}
    });
  },

  // findById(id){
  //   return User.findByPk(id);
  // },

  finsUserByEmail(email) {
    return User.findOne({
      where : {email}
    })
  },

  
};
