const historyRepository = require("../repositories/historyRepository");
const { transaction } = require("../models");


module.exports = {
    async get(req, res) {
        const user = req.user;
        const id = user.id

        try{

            const history = await historyRepository.find(id)
           
            
            res.status(200).json({
                staus: "Ok",
                data:history
            });

        }catch(error){
            throw error

        }
        

    }
}