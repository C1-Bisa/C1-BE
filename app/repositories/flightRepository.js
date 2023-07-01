const { Flight } = require("../models");
const { Airline } = require("../models");
const { Airport } = require("../models");

module.exports = {

    findAll() {
        return Flight.findAll({
            include: [
                {
                    model: Airline,
                    attributes: ['airline_name', 'airline_code', 'image'],

                },   
                {
                  model: Airport,
                  as: "Airport_from",
                  attributes: ['airport_name', 'airport_code', 'airport_location'],

              },   
              {
                  model: Airport,
                  as: "Airport_to",
                  attributes: ['airport_name', 'airport_code', 'airport_location'],

              }     
            ]
            });
      },

    findTicketFilter(id) {
        return Flight.findAll({
            where: {id:id},
            include: [
                {
                    model: Airline,
                    attributes: ['airline_name', 'airline_code', 'image'],
                },   
                {
                    model: Airport,
                    as: "Airport_from",
                    attributes: ['airport_name', 'airport_code', 'airport_location'],

                },   
                {
                    model: Airport,
                    as: "Airport_to",
                    attributes: ['airport_name', 'airport_code', 'airport_location'],

                }   
            ]
            });
      },

      findAirport(id) {
        return Airport.findByPk(id);
      },
      
      findFlight(id) {
        return Flight.findOne({
          where: {id},
          attributes: ['departure_date', 'departure_time', 'arrival_time', 'arrival_date', 'from', 'to', 'duration', 'price', 'flight_class', 'description'],
          include: [ 
                  {
                    model: Airport,
                    as: "Airport_from",
                    attributes: ['airport_name', 'airport_code', 'airport_location'],
                  },
                  {
                    model: Airport,
                    as: "Airport_to",
                    attributes: ['airport_name', 'airport_code', 'airport_location'],
                  },
                  {
                    model: Airline,
                    as: "Airline",
                    attributes: ['airline_name', 'airline_code', 'image'],
                  },
          ]
          
        });
      },

      findFlightData(id) {
        return Flight.findOne({
          where: {id},
          attributes: ['departure_date', 'departure_time', 'arrival_time', 'arrival_date', 'from', 'to', 'duration', 'price', 'flight_class', 'description'],
          include: [ 
                  {
                    model: Airport,
                    as: "Airport_from",
                    attributes: ['id', 'airport_name', 'airport_code', 'airport_location'],
                  },
                  {
                    model: Airport,
                    as: "Airport_to",
                    attributes: ['id', 'airport_name', 'airport_code', 'airport_location'],
                  },
                  {
                    model: Airline,
                    as: "Airline",
                    attributes: ['airline_name', 'airline_code', 'image'],
                  },
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
      },

      findLocation(loc){
        return Airport.findOne({
          where : {airport_location: loc}
        })
      },
};
