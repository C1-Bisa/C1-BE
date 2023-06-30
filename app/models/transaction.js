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
      // we are adding the following
      this.belongsToMany(models.Flight, { 
        foreignKey: 'transaction_id', 
        through: 'Transaction_Flight', 
      });
      this.hasMany(
        models.Transaction_Flight,{
          foreignKey: 'transaction_id', 
          as: 'Grant'
        });
      this.hasMany(models.Passenger, {
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