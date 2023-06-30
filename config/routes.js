const express = require("express");
const controllers = require("../app/controllers/api/v1");
const controller = require("../app/controllers");
const services = require("../app/services/userService") 
const auth = require ("../middleware/auth");
const swaggerDocument = require('../docs/openapi.json');
const swaggerUi = require('swagger-ui-express');


const apiRouter = express.Router();

apiRouter.use('/api', swaggerUi.serve);
apiRouter.get('/api', swaggerUi.setup(swaggerDocument));

//Notification
apiRouter.get("/api/v1/notification", auth, controllers.authController.getNotif);
apiRouter.get("/api/v1/notification/update", auth, controllers.authController.updateNotif);

//get flight and get detail
apiRouter.get("/api/v1/flight/getflight", controllers.flightController.listflight);
apiRouter.post("/api/v1/flight/getDetail", controllers.flightController.getDetail);

// Reset Password
apiRouter.put("/api/v1/user/createNewPassword",controllers.userController.updatepass);
apiRouter.post("/api/v1/user/resetPassword",controllers.userController.resetpass);

//USER 

apiRouter.put("/api/v1/user/verification", controllers.userController.verifikasi); 
apiRouter.post("/api/v1/user/logout", controllers.authController.logout);
apiRouter.delete("/api/v1/user/delete/:id",controllers.authController.authorizeAdmin,controllers.userController.destroy);
apiRouter.get("/api/v1/user",controllers.authController.authorizeAdmin,controllers.userController.list);
apiRouter.post("/api/v1/user/register",controllers.userController.register);
apiRouter.get("/api/v1/user/getProfile",auth,controllers.authController.getProfile);
apiRouter.put("/api/v1/user/update",auth,services.update);
// apiRouter.get("/api/v1/user/:id", controllers.userController.checkUser);
apiRouter.get("/api/v1/user/resendcode/:id", controllers.userController.resend);
apiRouter.post("/api/v1/user/login",controllers.authController.login);


//FLIGHT
apiRouter.post("/api/v1/flight/searchflight",controllers.flightController.searchFlight);
apiRouter.post("/api/v1/flight/createflight", controllers.authController.authorizeAdmin, controllers.flightController.createflight);
apiRouter.put("/api/v1/flight/updateflight/:id", controllers.authController.authorizeAdmin, controllers.flightController.updateflight);
apiRouter.delete("/api/v1/flight/deleteflight/:id", controllers.authController.authorizeAdmin, controllers.flightController.deleteflight);

// Airline
apiRouter.get("/api/v1/airline",controllers.airlineController.list);
apiRouter.get("/api/v1/airline/:id",controllers.airlineController.getById);
apiRouter.post("/api/v1/airline", controllers.authController.authorizeAdmin,controllers.airlineController.create);
apiRouter.put("/api/v1/airline/:id",controllers.authController.authorizeAdmin,controllers.airlineController.update);
apiRouter.delete("/api/v1/airline/:id", controllers.authController.authorizeAdmin,controllers.airlineController.destroy);

// Airport
apiRouter.get("/api/v1/airport",controllers.airportController.list);
apiRouter.get("/api/v1/airport/:id",controllers.airportController.getById);
apiRouter.post("/api/v1/airport",controllers.authController.authorizeAdmin ,controllers.airportController.create);
apiRouter.put("/api/v1/airport/:id",controllers.authController.authorizeAdmin ,controllers.airportController.update);
apiRouter.delete("/api/v1/airport/:id",controllers.authController.authorizeAdmin ,controllers.airportController.destroy);

// Transaction
apiRouter.post("/api/v1/transaction",auth,controllers.transactionController.create);
apiRouter.get("/api/v1/transaction/history",auth,controllers.transactionController.getHistory);
apiRouter.put("/api/v1/transaction/update",auth,controllers.transactionController.update);
apiRouter.post("/api/v1/transaction/getById",auth,controllers.transactionController.getById);
apiRouter.post("/api/v1/transaction/printticket",auth,controllers.transactionController.printTicket);


apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controller.api.main.onLost);
apiRouter.use(controller.api.main.onError);

module.exports = apiRouter;
