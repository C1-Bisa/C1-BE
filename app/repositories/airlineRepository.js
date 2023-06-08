const { Airline } = require("../models");

module.exports = {

    create(createArgs){
        return Airline.create(createArgs);
    },

    findAll() {
        return Airline.findAll();
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
}
