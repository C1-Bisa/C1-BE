const { Transaction } = require("../models");
const { Passenger } = require("../models");
const { Flight, Transaction_Flight, Airport, Airline } = require("../models");

module.exports = {

    create(createArgs){
        return Transaction.create(createArgs);
      },

    createPassenger(createArgs){
        return Passenger.create(createArgs);
      },
  
    update(id,code, updateArgs){
        return Transaction.update(updateArgs,{
            where: {
                user_id: id,
                transaction_code: code
            },
        })
      },

      findAll(id) {
        return Transaction.findAll({
          where: {user_id: id},
          attributes: ['transaction_code', 'user_id','amount', 'transaction_status', 'transaction_date'],
          include: [
            {
                model: Passenger,
                attributes: ['name', 'title', 'type', 'transactionCode', 'nik_paspor', 'seatDeparture', 'seatReturn'],
            },
            {
              model: Flight,
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

            },
          ]
        });
      },

      async addFlight(transactionId,flightId,transactionType){
        const transaction = await Transaction.findByPk(transactionId);
        const flight = await Flight.findByPk(flightId);

        await transaction.addFlight(flight, { through: { transaction_type: transactionType } });

      },

      // getType(id){
      //   return Transaction_Flight.findAll({
      //     where: {transaction_id: id},
      //     attributes: ['transaction_type'],
      //     include: [
      //       {
      //           model: Flight,
      //           attributes: ['departure_date', 'departure_time', 'arrival_time', 'arrival_date', 'from', 'to', 'duration', 'price', 'flight_class', 'description'],
      //           include: [
      //             {
      //               model: Airport,
      //               as: "Airport_from",
      //               attributes: ['airport_name', 'airport_code', 'airport_location'],
      //             },
      //             {
      //               model: Airport,
      //               as: "Airport_to",
      //               attributes: ['airport_name', 'airport_code', 'airport_location'],
      //             },
      //             {
      //               model: Airline,
      //               as: "Airline",
      //               attributes: ['airline_name', 'airline_code'],
      //             },
      //           ]
      //       }
      //     ]
      //   })
      // },

      getTransactionFlight(id) {   
        return Transaction_Flight.findAll({
          where: {transaction_id: id},
          attributes: ['transaction_type'],
          include: [
            {
              model:Transaction,
              attributes: ['amount']
            },
            {
                model: Flight,
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
            }
          ]
        });
      },

      findPassenger(transactionId){
        return Transaction.findOne({
          where:{id: transactionId},
          attributes: ['id', 'transaction_code', 'user_id', 'transaction_status', 'transaction_date'],
          include: [
            {
              model: Passenger,
              attributes: ['name', 'title', 'type', 'seatDeparture','seatReturn', 'transactionCode', 'nik_paspor', 'seatDeparture', 'seatReturn'],
            }
          ]
        })
      }

}  
      



