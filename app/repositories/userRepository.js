const { User } = require("../models");

module.exports = {

  findAll() {
    return User.findAll();
  },
  
  getTotalUser() {
    return User.count();
  },
};
