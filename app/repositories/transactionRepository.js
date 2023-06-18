const { transaction } = require("../models");

module.exports = {

    create(createArgs){
        return transaction.create(createArgs);
      },
  
      update(id, updateArgs){
        return transaction.update(updateArgs,{
            where: {
                id,
            },
        })
      },

}
