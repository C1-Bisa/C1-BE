const flightService = require("../../../services/flightService");

module.exports = {

listflight(req, res) {
    flightService
      .listFlight(req.body, req.query)
      .then(({ data, count }) => {
        res.status(200).json({
          status: "Success",
          data: { flight: data },
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

createflight(req, res) {
    flightService
      .create(req.body)
      .then((flight) => {
        if(!flight.data){
            res.status(422).json({
              status: flight.status,
              message: flight.message,
            });
            return;
          }
  
          res.status(201).json({
            status: flight.status,
            message: flight.message,
            data: {
              flight: flight.data
            }
          });
      })
      .catch((err) => {
        res.status(400).json({
          status: "Failed",
          message: err.message,
        });
      });
  },

searchFlight(req, res) {
    flightService
      .search(req.body, req.query)
      .then((flight) => {
        if(!flight.data){
            res.status(422).json({
              status: flight.status,
              message: flight.message,
            });
            return;
          }
  
          res.status(200).json({
            status: flight.status,
            message: flight.message,
            data: {
              flight: flight.data
            }
          });
      })
      .catch((err) => {
        res.status(400).json({
          status: "Failed",
          message: err.message,
        });
      });
  },

updateflight(req, res) {
    flightService
      .update(req.params.id, req.body)
      .then((flight) => {
        if(!flight.data){
            res.status(422).json({
              status: flight.status,
              message: flight.message,
            });
            return;
          }
  
          res.status(201).json({
            status: flight.status,
            message: flight.message
          });
      })
      .catch((err) => {
        res.status(400).json({
          status: "Failed",
          message: err.message,
        });
      });
  },

deleteflight(req, res) {
    flightService
      .delete(req.params.id)
      .then((flight) => {
        if(!flight.data){
          res.status(422).json({
            status: flight.status,
            message: flight.message,
          });
          return;
        }
          res.status(200).json({
            status: flight.status,
            message: flight.message
          });
      })
      .catch((err) => {
        res.status(400).json({
          status: "Failed",
          message: err.message,
        });
      });
  },
getDetail(req, res) {
    flightService
      .getDetail(req)
      .then((flight) => {
        if(!flight.data){
          res.status(422).json({
            status: flight.status,
            message: flight.message,
          });
          return;
        }
          res.status(200).json({
            status: flight.status,
            message: flight.message,
            data: flight.data
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
