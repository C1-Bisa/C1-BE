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
        .update(req.params.id, req)
        .then((airline) => {
          res.status(201).json({
            status: "OK",
            message: "Data updated success",
            data: airline

          });
        })
        .catch((err) => {
          res.status(422).json({
            status: "FAIL",
            message: err.message,
          });
        });
    },

    async destroy(req,res){
      airlineService
      .delete(req.params.id)
      .then((airline)=>{
        res.status(201).json({
          status: "OK",
          massage: "Airplane success deleted!"
        })
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
      // try {
      //   const airline = req.airline; 
      //   await airlineService.delete(airline.id);
      //   res.status(200).json({
      //     status: "OK",
      //     message: "Airplane deleted success!",
      //   });
      // } catch (err) {
      //   res.status(err.statusCode).json({
      //     status: "FAIL",
      //     message: err.message,
      //   });
      // }
    },

    async checkAirline (req, res, next) {
      try {
        const id = req.params.id;
        const airlinePayload = await airlineService.get(id);
    
        if (!airlinePayload) {
          res.status(404).json({
            status: "FAIL",
            message: `airline not found!`,
          });
          return;
        }
    
        req.airline = airlinePayload;
  
        next();
      } catch (err) {
        res.status(500).json({
          status: "FAIL",
          message: "server error!",
        });
      }
    },
    
     
}
