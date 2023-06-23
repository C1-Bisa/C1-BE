const { Transaction } = require("../models");
const { Passenger } = require("../models");
const { Flight, Transaction_Flight } = require("../models");
const transaction_flight = require("../models/transaction_flight");

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
          include: [
            {
                model: Passenger
            }
        ]
        });
      },

      transactionFlight() {
        
        return Transaction.findOne({
          where: { transaction_code: "VT5VX0V84Z" },
          include: Flight
        })
      },

      findPassenger(token) {
        return Passenger.findAll({
          where: {transactionCode: token}
        });
      },


      async addTransactionFlight(transactionId, flightId) {
      const transaction = await Transaction.findByPk(transactionId);
      const flight = await Flight.findByPk(flightId);
        
      await transaction.addFlight(flight, { through: { transaction_type: "departure" } });


      },

     
      
}


