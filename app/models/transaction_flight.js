'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction_Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Transaction, { 
        foreignKey: 'transaction_id', 
      });
      this.belongsTo(models.Flight, { 
        foreignKey: 'flight_id', 
      });
    }
  }
  Transaction_Flight.init({
    transaction_id: DataTypes.INTEGER,
    flight_id: DataTypes.INTEGER,
    transaction_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction_Flight',
  });
  return Transaction_Flight;
};