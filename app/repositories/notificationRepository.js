const {Notification} = require("../models");

module.exports = {
    create(createArgs){
        return Notification.create(createArgs);
    },

    update(userId, updateArgs){
        return Notification.update(updateArgs,{
            where: {
                userId: userId,
            },
        })
    },
}