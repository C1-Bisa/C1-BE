'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Passengers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Transactions"
          },
          key: 'id'
        }
      },
      transactionCode: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM,
        values: ['Adult', 'Child', 'Baby']

      },
      title: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      family_name: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      nationality: {
        type: Sequelize.STRING
      },
      nik_paspor: {
        type: Sequelize.STRING
      },
      seatDeparture: {
        type: Sequelize.STRING
      },
      seatReturn: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Passengers');
  }
};