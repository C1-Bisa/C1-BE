const flightRepository = require("../repositories/flightRepository");

module.exports = {

  async list() {
    try {
      const users = await flightRepository.findAll();
      const userCount = await flightRepository.getTotalUser();

      return {
        data: users,
        count: userCount,
      };
    } catch (err) {
      throw err;
    }
  },

  
};
