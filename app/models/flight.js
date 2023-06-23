'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Transaction, { 
        foreignKey: 'flight_id', 
        through: 'Transaction_Flight', 
      });
      this.hasMany(
        models.Transaction_Flight,{
          foreignKey: 'flight_id', 
          as: "Grant"
        }
        );
      this.belongsTo(models.Airline, {
        foreignKey:'airline_id'
      })
      this.belongsTo(models.Airport, {
        foreignKey:'airport_id_from',
        as: 'Airport_from'
      })
      this.belongsTo(models.Airport, {
        foreignKey:'airport_id_to',
        as: 'Airport_to'
      })
    }
  }
  Flight.init({
    airline_id: DataTypes.INTEGER,
    airport_id_from: DataTypes.INTEGER,
    airport_id_to: DataTypes.INTEGER,
    departure_date: DataTypes.DATE,
    departure_time: DataTypes.TIME(4),
    arrival_date: DataTypes.DATE,
    arrival_time: DataTypes.TIME(4),
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    flight_class: {
      type: DataTypes.ENUM,
      values: ['Economy', 'Premium Economy', 'Bussiness', 'First Class']
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};