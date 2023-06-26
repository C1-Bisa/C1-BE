const { Flight } = require("../models");
const { Airline } = require("../models");
const { Airport } = require("../models");

module.exports = {

    findAll() {
        return Flight.findAll({
          // attributes: ['departure_date', 'departure_time', 'arrival_date', 'arrival_time', 'duration', 'price', 'flight_class', 'description'],
            include: [
                {
                    model: Airline,
                    attributes: ['airline_code', 'airline_name'],

                },   
                {
                  model: Airport,
                  attributes: ['airport_code', 'airport_name'],
                  as: "Airport_from"
              },   
              {
                  model: Airport,
                  attributes: ['airport_code', 'airport_name'],
                  as: "Airport_to"
              }     
            ]
          });
    },

    findTicketFilter(id) {
        return Flight.findAll({
            where: {id:id},
            attributes: ['departure_date', 'departure_time', 'arrival_date', 'arrival_time','duration','price','flight_class','description'],
            include: [
                {
                    model: Airline,
                    attributes: ['airline_code', 'airline_name']
                },   
                {
                    model: Airport,
                    attributes: ['airport_code', 'airport_name'],
                    as: "Airport_from"
                },   
                {
                    model: Airport,
                    attributes: ['airport_code', 'airport_name'],
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
                    attributes: ['airline_name', 'airline_code'],
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
