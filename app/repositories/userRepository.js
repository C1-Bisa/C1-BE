const { User } = require("../models");

module.exports = {

  findAll() {
    return User.findAll();
  },
  
  getTotalUser() {
    return User.count();
  },

  find(id) {
    return User.findByPk(id);
  },

  finsUserByEmail(email) {
    return User.findOne({
      where : {email}
    })
  },

  
};
