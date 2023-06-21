const { Transaction } = require("../models");
const { Passenger } = require("../models");
// const { Transaction_Flight } = require("../models");

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

      findPassenger(token) {
        return Passenger.findAll({
          where: {transactionCode: token}
        });
      },

      // createTransactionFlight(createArgs){
      //   return Transaction_Flight.create(createArgs);


      // }

}
