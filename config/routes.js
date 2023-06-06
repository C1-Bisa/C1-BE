const express = require("express");
const controllers = require("../app/controllers");

const apiRouter = express.Router();


apiRouter.get("/api/v1/user", controllers.api.v1.userController.list);
// apiRouter.post("/api/v1/users/register",controllers.api.v1.authController.register);
apiRouter.post("/api/v1/users/login", controllers.api.v1.authController.login);
apiRouter.post("/api/v1/user/register", controllers.api.v1.userController.register);
apiRouter.get("/api/v1/user/verification", controllers.api.v1.userController.verifikasi);
apiRouter.get("/api/v1/user/resendcode/:id", controllers.api.v1.userController.resend);

apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
