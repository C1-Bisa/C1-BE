const express = require("express");
const controllers = require("../app/controllers");

const apiRouter = express.Router();

apiRouter.get('/', (req,res)=>{

  // read cookies
  console.log(req.cookies) 

  let options = {
      maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      httpOnly: true, // The cookie only accessible by the web server
      signed: true // Indicates if the cookie should be signed
  }

  // Set cookie
  res.cookie('cookieName', 'cookieValue', options) // options is optional
  res.send('')

})

//USER
apiRouter.get("/api/v1/user", controllers.api.v1.userController.list);
apiRouter.post("/api/v1/user/register", controllers.api.v1.userController.register);
apiRouter.get("/api/v1/user/verification", controllers.api.v1.userController.verifikasi);
apiRouter.get("/api/v1/user/resendcode/:id", controllers.api.v1.userController.resend);
apiRouter.post("/api/v1/users/login", controllers.api.v1.authController.login);
apiRouter.get("/api/v1/users/logout", controllers.api.v1.authController.logout);

//FLIGHT
apiRouter.get("/api/v1/flight/getflight", controllers.api.v1.flightController.listflight);
apiRouter.post("/api/v1/flight/createflight", controllers.api.v1.flightController.createflight);
apiRouter.put("/api/v1/flight/updateflight/:id", controllers.api.v1.flightController.updateflight);
apiRouter.delete("/api/v1/flight/deleteflight/:id", controllers.api.v1.flightController.deleteflight);


apiRouter.get("/api/v1/errors", () => {
  throw new Error(
    "The Industrial Revolution and its consequences have been a disaster for the human race."
  );
});

apiRouter.use(controllers.api.main.onLost);
apiRouter.use(controllers.api.main.onError);

module.exports = apiRouter;
