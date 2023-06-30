const airlineService = require("../../../services/airlineSercive");

module.exports = {
    create(req, res) {
        airlineService
          .create(req)
          .then((airline) => {
            res.status(201).json({
              status: airline.status,
              message: airline.message,
              data: airline.data,
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
          if(!airline.data){
            res.status(422).json({
              status: "Airline not found",
            });
            return;
          }
          res.status(200).json({
            status: "Airline found!",
            data: airline.data
            
          });
        })
        .catch((err) => {
          res.status(422).json({
            status: "FAIL"
          });
        });
    },

    update(req, res) {
      airlineService
        .update(req.params.id, req.body)
        .then((airline) => {
          if(!airline.data){
            res.status(422).json({
              status: "FAIL",
              massage: "Airline not found!"
            });
            return;
          }
          res.status(200).json({
            status: airline.status,
            massage: airline.message
          });
        })
        .catch((error) => {
          res.status(error.statusCode || 500).json({
          message: error.message,
          });
        });
    },

    destroy(req, res) {
      airlineService
        .delete(req.params.id)
        .then((airline) => {
          if(!airline.data){
            res.status(422).json({
              status: airline.status,
              message: airline.message
            });
            return;
          }
          res.status(200).json({
            status: airline.status,
            message: airline.message
          });
        })
        .catch((error) => {
          res.status(422).json({
            status: "FAIL"
          });
        });
    },
    
    
}
