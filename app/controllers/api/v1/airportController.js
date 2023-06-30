const airportService = require("../../../services/airportService");

module.exports = {
    
    list(req, res) {
        airportService
          .list()
          .then(({ data }) => {
            res.status(200).json({
              status: "OK",
              data: { airport: data },
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
        airportService
          .getById(req.params.id)
          .then(( airport ) => {
            if(!airport.data){
              res.status(422).json({
                status: "FAIL",
                massage: "Aiport not found!"
              });
              return;
            }
            res.status(200).json({
              status: "Airport found!",
              data: airport,
            });
          })
          .catch((err) => {
            res.status(400).json({
              status: "FAIL",
              message: err.message,
            });
          });
    },

    create(req, res) {
        airportService
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

    update(req, res) {
      airportService
        .update(req.params.id, req.body)
        .then((airport) => {
          if(!airport.data){
            res.status(422).json({
              status: "FAIL",
              massage: "Aiport not found!"
            });
            return;
          }
          res.status(200).json({
            status: "OK",
            massage: airport.message,
            data: airport.data
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
      airportService
        .delete(req.params.id)
        .then((airport) => {
          if(!airport.data){
            res.status(422).json({
              status: airport.status,
              message: airport.message,
            });
            return;
          }
          res.status(200).json({
            status: airport.status,
            message: airport.message,
          });
        })
        .catch((error) => {
          res.status(422).json({
            status: "FAIL",
            message: error.message
          });
        });
    },

    // checkAirport(req, res, next) {
    //   try {
    //     const id = req.params.id;
    //     airportService.get(id)
    //       .then((airportPayload) => {
    //         if (!airportPayload) {
    //           res.status(404).json({
    //             status: "FAIL",
    //             message: "Airport not found!"
    //           });
    //           return;
    //         }
    
    //         req.airport = airportPayload;
    //         next();
    //       })
    //       .catch((error) => {
    //         res.status(500).json({
    //           status: "FAIL",
    //           message: "Server error!"
    //         });
    //       });
    //   } catch (error) {
    //     res.status(500).json({
    //       status: "FAIL",
    //       message: "Server error!"
    //     });
    //   }
    // }
    
}
