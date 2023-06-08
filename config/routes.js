const express = require("express");
const controllers = require("../app/controllers");

const apiRouter = express.Router();

apiRouter.get("/api/v1/user",controllers.api.v1.userController.list);
apiRouter.post("/api/v1/user/register",controllers.api.v1.userController.register);
apiRouter.put("/api/v1/user/update/:id",controllers.api.v1.userController.update);
apiRouter.delete("/api/v1/user/delete/:id", controllers.api.v1.userController.destroy);
apiRouter.get("/api/v1/user/:id", controllers.api.v1.userController.checkUser);
apiRouter.get("/api/v1/user/verification", controllers.api.v1.userController.verifikasi);
apiRouter.get("/api/v1/user/resendcode/:id", controllers.api.v1.userController.resend);
apiRouter.post("/api/v1/user/login", controllers.api.v1.authController.login);
apiRouter.get("/api/v1/user/logout", controllers.api.v1.authController.logout);

//FLIGHT
apiRouter.get("/api/v1/flight", controllers.api.v1.flightController.list);


apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
