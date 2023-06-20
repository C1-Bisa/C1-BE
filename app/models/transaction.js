'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Flight, {
        foreignKey:'flight_id'
      })
      this.hasMany(models.passenger, {
        foreignKey:'transaction_id'
      })
    }
  }
  transaction.init({
    transaction_code: DataTypes.STRING,
    flight_id: DataTypes.ARRAY(DataTypes.INTEGER),
    user_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    transaction_status: DataTypes.STRING,
    transaction_date: DataTypes.DATE,
    flight_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};