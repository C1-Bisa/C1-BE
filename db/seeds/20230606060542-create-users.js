'use strict';

const bcrypt = require("bcryptjs");

const encryptPassword = async (encryptedPassword) => {
  try{
    const password = await bcrypt.hash(encryptedPassword,10);
    return password;
  }catch(err){
    return err;
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await encryptPassword('risa123');

    return queryInterface.bulkInsert('Users', [{
      nama: 'risa',
      email: 'risa@gmail.com',
      password:  password,
      phone: "08123421242",
      role: 'User',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', {role:'User'}, {});
  }
};
