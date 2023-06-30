'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airline_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Airlines"
          },
          key: 'id'
        }
      },
      airport_id_from: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Airports"
          },
          key: 'id'
        }
      },
      airport_id_to: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Airports"
          },
          key: 'id'
        }
      },
      departure_date: {
        type: Sequelize.DATE
      },
      departure_time: {
        type: Sequelize.TIME(4)
      },
      arrival_date: {
        type: Sequelize.DATE
      },
      arrival_time: {
        type: Sequelize.TIME(4)
      },
      from: {
        type: Sequelize.STRING
      },
      to: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      flight_class: {
        type: Sequelize.ENUM,
        values: ['Economy', 'Premium Economy', 'Bussiness', 'First Class']
      },
      description: {
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
    await queryInterface.dropTable('Flights');
  }
};