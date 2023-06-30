const {Notification} = require("../models");

module.exports = {
    findAll(id) {
        return Notification.findAll({
            where:{userId: id}
        });
      },

    findNotifIsread(id) {
        return Notification.count({
            where:{userId: id, isRead: false}
        });
      },

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