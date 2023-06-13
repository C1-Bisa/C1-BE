const express = require("express");
const controllers = require("../app/controllers/api/v1");
const services = require("../app/services/userService") 
const auth = require ("../middleware/auth");
const swaggerDocument = require('../docs/openapi.json');
const swaggerUi = require('swagger-ui-express');
const controller = require("../app/controllers")



const apiRouter = express.Router();

apiRouter.use('/api', swaggerUi.serve);
apiRouter.get('/api', swaggerUi.setup(swaggerDocument));


// Reset Password
apiRouter.post("/api/v1/user/resetPassword",controllers.userController.resetpass);
apiRouter.put("/api/v1/user/createNewPassword/:id/:token",controllers.userController.updatepass);

//USER 

apiRouter.put("/api/v1/user/verification", controllers.userController.verifikasi); 
apiRouter.post("/api/v1/user/logout", controllers.authController.logout);
apiRouter.delete("/api/v1/user/delete/:id",controllers.authController.authorizeAdmin,controllers.userController.checkUser ,controllers.userController.destroy);
apiRouter.get("/api/v1/user",controllers.authController.authorizeAdmin,controllers.userController.list);
apiRouter.post("/api/v1/user/register",controllers.userController.register);
apiRouter.put("/api/v1/user/update",auth,services.update);
apiRouter.get("/api/v1/user/:id", controllers.userController.checkUser);
apiRouter.get("/api/v1/user/resendcode/:id", controllers.userController.resend);
apiRouter.post("/api/v1/user/login",controllers.authController.login);


//FLIGHT
apiRouter.get("/api/v1/flight/getflight", controllers.flightController.listflight);
apiRouter.post("/api/v1/flight/createflight",  controllers.flightController.createflight);
apiRouter.put("/api/v1/flight/updateflight/:id", controllers.authController.authorizeAdmin, controllers.flightController.updateflight);
apiRouter.delete("/api/v1/flight/deleteflight/:id", controllers.authController.authorizeAdmin, controllers.flightController.deleteflight);
apiRouter.post("/api/v1/flight/searchflight",  controllers.flightController.searchflight);


// Airline
apiRouter.get("/api/v1/airline", controllers.authController.authorizeAdmin,controllers.airlineController.list);
apiRouter.get("/api/v1/airline/:id", controllers.authController.authorizeAdmin,controllers.airlineController.checkAirline,controllers.airlineController.getById);
apiRouter.post("/api/v1/airline", controllers.authController.authorizeAdmin,controllers.airlineController.create);
apiRouter.put("/api/v1/airline/:id",controllers.authController.authorizeAdmin,controllers.airlineController.checkAirline,controllers.airlineController.update);
apiRouter.delete("/api/v1/airline/:id", controllers.authController.authorizeAdmin,controllers.airlineController.checkAirline,controllers.airlineController.destroy);

// Airport
apiRouter.get("/api/v1/airport",controllers.authController.authorizeAdmin ,controllers.airportController.list);
apiRouter.get("/api/v1/airport/:id",controllers.authController.authorizeAdmin ,controllers.airportController.checkAirport,controllers.airportController.getById);
apiRouter.post("/api/v1/airport",controllers.authController.authorizeAdmin ,controllers.airportController.create);
apiRouter.put("/api/v1/airport/:id",controllers.authController.authorizeAdmin ,controllers.airportController.checkAirport,controllers.airportController.update);
apiRouter.delete("/api/v1/airport/:id",controllers.authController.authorizeAdmin ,controllers.airportController.checkAirport,controllers.airportController.destroy);


apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controller.api.main.onLost);
apiRouter.use(controller.api.main.onError);

module.exports = apiRouter;
