const { Airline } = require("../models");

module.exports = {

    create(createArgs){
        return Airline.create(createArgs);
    },

    findAll() {
        return Airline.findAll({
          attributes: ['id','airline_code', 'airline_name']
        });
    },

    find(id) {
        return Airline.findByPk(id);
    },

    update(id, updateArgs) {
        return Airline.update(updateArgs, {
          where: {
            id,
          },
        });
    },

    delete(carId) {
      return Airline.destroy({ 
        where: { 
          id: carId 
        }
      });
    },

    findAirline(id){
      return Airline.findOne({
        where: {id}
      })
    },
}
