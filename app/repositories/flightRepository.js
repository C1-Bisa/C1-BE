const { Flight } = require("../models");
const { Airline } = require("../models");
const { Airport } = require("../models");

module.exports = {

    findAll() {
        return Flight.findAll({
            include: [
                {
                    model: Airline
                },   
                {
                    model: Airport
                }   
            ]
            });
      },
      
      getTotalFlight() {
        return Flight.count();
      },

      create(createArgs){
        return Flight.create(createArgs);
      },
  
      update(id, updateArgs){
        return Flight.update(updateArgs,{
            where: {
                id,
            },
        })
      },

      delete(id){
        return Flight.destroy({
            where: {
                id,
            },
        })
      }
};
