'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class verified extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  verified.init({
    userId: DataTypes.INTEGER,
    verifiedToken: DataTypes.STRING,
    expiredDate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'verified',
  });
  return verified;
};