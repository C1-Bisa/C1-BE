const userService = require("../../../services/userService");

module.exports = {

  list(req, res) {
    userService
      .list()
      .then(({ data, count }) => {
        res.status(200).json({
          status: "Success",
          data: { users: data },
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

  register(req, res) {
    userService
      .create(req.body)
      .then((code) => {
        if(!code.data){
          res.status(422).json({
            status: code.status,
            message: code.message,
          });
          return;
        }

        res.status(201).json({
          status: code.status,
          message: code.message,
          data: {
            user: code.data,
            otp: code.otp
          }
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "Failed",
          message: err.message,
        });
      });
  },


  verifikasi(req, res) {
    userService
      .check(req.body)
      .then((verify) => {
        if(!verify.data){
          res.status(422).json({
            status: verify.status,
            message: verify.message,
          });
          return;
        }

        res.status(201).json({
          subject: verify.subject,
          message: verify.message,
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "Failed",
          message: err.message,
        });
      });
  },

  resend(req, res) {
    userService
      .resendCode(req.params.id)
      .then((verify) => {
        if(!verify.data){
          res.status(422).json({
            status: verify.status,
            message: verify.message,
            data: null
          });
          return;
        }

        res.status(201).json({
          subject: verify.data.subject,
          message: verify.data.message,
          otp: verify.data.otp
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "Failed",
          message: err.message,
        });
      });
  },
  
};
