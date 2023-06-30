const { Airport } = require("../models");

module.exports = {
    create(createArgs){
        return Airport.create(createArgs);
    },

    findAll() {
        return Airport.findAll();
    },

    find(id) {
        return Airport.findByPk(id);
    },

    update(id, updateArgs) {
        return Airport.update(updateArgs, {
          where: {
            id: id
          },
          attributes: ['id', 'airport_code', 'airport_name', 'airport_location']
        });
    },

    delete(airportId) {
      return Airport.destroy({ 
        where: { 
          id: airportId 
        }
      });
    },

}
