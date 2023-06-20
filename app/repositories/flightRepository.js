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
                  model: Airport,
                  as: "Airport_from"
              },   
              {
                  model: Airport,
                  as: "Airport_to"
              }     
            ]
            });
      },

    findTicketFilter(id) {
        return Flight.findAll({
            where: {id:id},
            include: [
                {
                    model: Airline
                },   
                {
                    model: Airport,
                    as: "Airport_from"
                },   
                {
                    model: Airport,
                    as: "Airport_to"
                }   
            ]
            });
      },

    findSchedule(from, to, departure_date, yesterday) {
      console.log(yesterday);
        return Flight.findAll({
            where: {
              to, 
              departure_date: departure_date >= yesterday
            },
            include: [
                {
                    model: Airline
                },   
                {
                    model: Airport,
                    where: {airport_location: from}
                }   
            ]
            });
      },

      findAirport(id) {
        return Airport.findByPk(id);
      },
      
      findFlight(id) {
        return Flight.findByPk(id);
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
      },

      findLocation(loc){
        return Airport.findOne({
          where : {airport_location: loc}
        })
      },
};
