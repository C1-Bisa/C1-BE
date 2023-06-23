'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaction_Flights', {
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
      flight_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Flights"
          },
          key: 'id'
        }
      },
      transaction_type: {
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
    await queryInterface.dropTable('Transaction_Flights');
  }
};