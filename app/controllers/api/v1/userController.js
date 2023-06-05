const userService = require("../../../services/userService");

module.exports = {

  list(req, res) {
    userService
      .list()
      .then(({ data, count }) => {
        res.status(200).json({
          status: "Success",
          data: { users: data },
          meta: { total: count },
        });
      })
      .catch((err) => {
        res.status(400).json({
          status: "Failed",
          message: err.message,
        });
      });
  },
  
};
