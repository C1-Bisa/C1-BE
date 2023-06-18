const transactionService = require("../../../services/transactionServices")

module.exports = {
    create(req, res) {
        transactionService
          .create(req)
          .then((airport) => {
            res.status(201).json({
              status: "OK",
              data: airport,
            });
          })
          .catch((err) => {
            res.status(422).json({
              status: "FAIL",
              message: err.message,
            });
          });
    },
}
