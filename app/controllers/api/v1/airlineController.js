const airlineService = require("../../../services/airlineSercive");

module.exports = {
    create(req, res) {
        airlineService
          .create(req)
          .then((airline) => {
            res.status(201).json({
              status: "OK",
              data: airline,
            });
          })
          .catch((err) => {
            res.status(422).json({
              status: "FAIL",
              message: err.message,
            });
          });
    },

    list(req, res) {
      airlineService
        .list()
        .then(({ data }) => {
          res.status(200).json({
            status: "OK",
            data: { airline: data },
          });
        })
        .catch((err) => {
          res.status(400).json({
            status: "FAIL",
            message: err.message,
          });
        });
    },

    getById(req, res) {
      airlineService
        .getById(req.params.id)
        .then(( airline ) => {
          res.status(200).json({
            status: "Airline found!",
            data: airline,
          });
        })
        .catch((err) => {
          res.status(400).json({
            status: "FAIL",
            message: err.message,
          });
        });
    },

    update(req, res) {
      airlineService
        .update(req.params.id, req.body)
        .then((airline) => {
          res.status(200).json({
            status: airline.status,
            massage: airline.message
          });
        })
        .catch((err) => {
          res.status(422).json({
            status: "FAIL",
            message: err.message,
          });
        });
    },

    destroy(req, res) {
      airlineService
        .delete(req.params.id)
        .then(() => {
          res.status(201).json({
            status: "OK",
            message: "Airplane successfully deleted!"
          });
        })
        .catch((error) => {
          res.status(422).json({
            status: "FAIL",
            message: error.message
          });
        });
    },
    
    checkAirline(req, res, next) {
      airlineService
        .get(req.params.id)
        .then((airlinePayload) => {
          if (!airlinePayload) {
            res.status(404).json({
              status: "FAIL",
              message: "airline not found!"
            });
            return;
          }
    
          req.airline = airlinePayload;
          next();
        })
        .catch((error) => {
          res.status(500).json({
            status: "FAIL",
            message: "server error!"
          });
        });
    }
    
}
