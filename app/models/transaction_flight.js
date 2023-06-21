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
      // define association here
    }
  }
  Transaction_Flight.init({
    transation_id: DataTypes.INTEGER,
    transaction_code: DataTypes.STRING,
    flight_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction_Flight',
  });
  return Transaction_Flight;
};