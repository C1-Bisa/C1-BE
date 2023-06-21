const { transaction } = require("../models");
const { passenger } = require("../models");
const { Flight } = require("../models");

module.exports = {

    create(createArgs){
        return transaction.create(createArgs);
      },

    createPassenger(createArgs){
        return passenger.create(createArgs);
      },
  
    update(id,code, updateArgs){
        return transaction.update(updateArgs,{
            where: {
                user_id: id,
                transaction_code: code
            },
        })
      },

      findAll(id) {
        
        return transaction.findAll({
          where: {user_id: id},
          include: [
            {
                model: passenger
            }
        ]
        });
      },

      findPassenger(token) {
        return passenger.findAll({
          where: {transactionCode: token}
        });
      },

}
