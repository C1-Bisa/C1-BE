const { Airline } = require("../models");

module.exports = {

    create(createArgs){
        return Airline.create(createArgs);
    },

    findAll() {
        return Airline.findAll({
          attributes: ['id','airline_code', 'airline_name', 'image']
        });
    },

    find(id) {
        return Airline.findByPk(id, {
          attributes: ['id','airline_code', 'airline_name', 'image']
        });
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
}
