const jwt = require("jsonwebtoken");
const {User} = require ("../app/models")
const {JWT_SIGNATURE_KEY} = process.env;
require('dotenv').config()

const auth = (req, res, next) => {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      
      if (!bearerToken) {
        return res.status(401).json({
          status: 'failed',
          message: 'Required authorization',
        });
      }
      const tokenPayload = jwt.verify(token, JWT_SIGNATURE_KEY);
      User.findByPk(tokenPayload.id).then((instance) => {
        req.user = instance;
        next();
      });
    } catch {
      res.status(401).json({
        status: 'failed',
        message: 'Invalid token',
      });
    }
  }
module.exports = auth;

