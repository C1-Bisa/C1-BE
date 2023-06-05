const userRepository = require("../repositories/userRepository");


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
