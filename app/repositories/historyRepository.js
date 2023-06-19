const { History } = require("../models");

module.exports = {
    create(createArgs){
        return History.create(createArgs);
    },

    find(userId){
        return History.findOne({
          where: {user_id: userId}
        })
    },

    findTransaction(){
        return History.findAll();
    },


}
