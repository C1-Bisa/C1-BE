const { transaction } = require("../models");
const { passenger } = require("../models");

module.exports = {

    create(createArgs){
        return transaction.create(createArgs);
      },

    createPassenger(createArgs){
        return passenger.create(createArgs);
      },
  
      update(id, updateArgs){
        return transaction.update(updateArgs,{
            where: {
                id,
            },
        })
      },

}
