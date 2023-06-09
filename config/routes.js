const express = require("express");
const controllers = require("../app/controllers");

const apiRouter = express.Router();

// Reset Password
apiRouter.get("/api/v1/user/resetPassword",controllers.api.v1.userController.resetpass); //s
apiRouter.put("/api/v1/user/createNewPassword/:id/:token",controllers.api.v1.userController.updatepass);//s

//USER
apiRouter.get("/api/v1/user/verification", controllers.api.v1.userController.verifikasi); //s
apiRouter.get("/api/v1/user/logout", controllers.api.v1.authController.logout); //s
apiRouter.get("/api/v1/user",controllers.api.v1.userController.list);
apiRouter.post("/api/v1/user/register",controllers.api.v1.userController.register);
apiRouter.put("/api/v1/user/update/:id",controllers.api.v1.userController.update);
apiRouter.delete("/api/v1/user/delete/:id",controllers.api.v1.userController.checkUser ,controllers.api.v1.userController.destroy);
apiRouter.get("/api/v1/user/:id", controllers.api.v1.userController.checkUser);
apiRouter.get("/api/v1/user/resendcode/:id", controllers.api.v1.userController.resend);
apiRouter.post("/api/v1/user/login", controllers.api.v1.authController.login);

//FLIGHT
apiRouter.get("/api/v1/flight/getflight", controllers.api.v1.authController.authorizeAdmin, controllers.api.v1.flightController.listflight);
apiRouter.post("/api/v1/flight/createflight", controllers.api.v1.authController.authorizeAdmin, controllers.api.v1.flightController.createflight);
apiRouter.put("/api/v1/flight/updateflight/:id", controllers.api.v1.authController.authorizeAdmin, controllers.api.v1.flightController.updateflight);
apiRouter.delete("/api/v1/flight/deleteflight/:id", controllers.api.v1.authController.authorizeAdmin, controllers.api.v1.flightController.deleteflight);


// Airline
apiRouter.post("/api/v1/airline/create", controllers.api.v1.airlineController.create);
apiRouter.get("/api/v1/airline", controllers.api.v1.airlineController.list);
apiRouter.get("/api/v1/airline/:id", controllers.api.v1.airlineController.getById);
apiRouter.put("/api/v1/airline/update/:id", controllers.api.v1.airlineController.update);
apiRouter.delete("/api/v1/airline/delete/:id", controllers.api.v1.airlineController.checkAirline,controllers.api.v1.airlineController.destroy);



apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
