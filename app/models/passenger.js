'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Transaction, {
        foreignKey:'transaction_id'
      })
    }
  }
  Passenger.init({
    transaction_id: DataTypes.INTEGER,
    transactionCode: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: ['Adult', 'Child', 'Baby']
    },
    title: DataTypes.STRING,
    name: DataTypes.STRING,
    family_name: DataTypes.STRING,
    birthday: DataTypes.DATE,
    nationality: DataTypes.STRING,
    nik_paspor: DataTypes.STRING,
    seatDeparture: DataTypes.STRING,
    seatReturn: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};