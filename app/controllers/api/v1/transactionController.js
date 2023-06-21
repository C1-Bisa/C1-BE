const transactionService = require("../../../services/transactionServices")

module.exports = {
    create(req, res) {
        transactionService
          .create(req)
          .then((transaction) => {
            if(!transaction.data){
              res.status(422).json({
                status: transaction.status,
                message: transaction.message,
              });
              return;
            }

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

    update(req, res) {
        transactionService
          .update(req)
          .then((transaction) => {
            if(!transaction.data){
              res.status(422).json({
                status: transaction.status,
                message: transaction.message,
              });
              return;
            }
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

    getHistory(req, res) {
      transactionService
        .history(req)
        .then((transaction) => {
          if(!transaction.data){
            res.status(422).json({
              status: transaction.status,
              message: transaction.message,
            });
            return;
          }

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
