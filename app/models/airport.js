'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Flight, {
        foreignKey:'airport_id_from',
        as: 'Airport_from'
      })
      this.hasMany(models.Flight, {
        foreignKey:'airport_id_to',
        as: 'Airport_to'
      })
    }

  }
  Airport.init({
    airport_code: DataTypes.STRING,
    airport_name: DataTypes.STRING,
    airport_location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airport',
  });
  return Airport;
};