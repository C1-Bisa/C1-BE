'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Flight, {
        foreignKey:'airline_id'
      })
    }
  }
  Airline.init({
    airline_code: DataTypes.STRING,
    airline_name: DataTypes.STRING,
    image: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'Airline',
  });
  return Airline;
};