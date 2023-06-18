const transactionService = require("../../../services/transactionServices")

module.exports = {
    create(req, res) {
        transactionService
          .create(req)
          .then((transaction) => {
            res.status(201).json({
              status: transaction.status,
              message: transaction.message,
              data: transaction.data,
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
