'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Flight, {
        through: "Transaction_Flights"
     });
     this.hasMany(models.Flight, {
       foreignKey:'transaction_id'
     })
    }
  }
  Transaction.init({
    transaction_code: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    transaction_status: DataTypes.STRING,
    transaction_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};