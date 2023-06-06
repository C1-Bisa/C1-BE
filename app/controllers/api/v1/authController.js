const userService = require("../../../services/userService")
const jwt = require("jsonwebtoken")
const {JWT_SIGNATURE_KEY} = process.env;
require('dotenv').config()

module.exports ={

  login(req, res) {
    userService
      .login(req.body)
      .then((user) => {
        if(!user.data){
          res.status(401).json({
            status: "FAIL",
            message : user.message,
            data: null,
          });
          return;
        }
        const token = user.data.token;
        res.cookie('jwtToken', token, { httpOnly: true, secure: false });

        res.status(201).json({
          status: "OK",
          data: {
            id: user.data.id,
            name: user.data.name,
            email: user.data.email,
            token
          },
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  
  logout(req, res) {
    // Hapus token dari cookie dengan mengeset waktu kadaluarsa ke masa lalu
    res.cookie('jwtToken', '', { expires: new Date(0) });
  
    // Kirim respon berhasil logout
    res.status(200).json({ message: 'Logout berhasil' });
  },

   // middleware 
   authorize(req,res,next) {
    try{
    // meendapatkan token 
    const bearerToken = req.headers.authorization; 
    const token = bearerToken.split("Bearer ")[1];

    const tokenPayload = jwt.verify(token,JWT_SIGNATURE_KEY);

    req.user = tokenPayload;

    next();
    }catch(err){
      console.log(err);
      res.status(401).json({
        message: "Unauthorize",
      });
    
    }
  },

}
