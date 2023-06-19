const historyService = require("../../../services/historyService")

module.exports = {

    get(req, res) {
        historyService
          .get()
          .then((history) => {
            res.status(200).json({
              status: history.status,
              data: history.data
            });
          })
          .catch((err) => {
            res.status(400).json({
              status: "Failed",
              message: err.message,
            });
          });
      },
}