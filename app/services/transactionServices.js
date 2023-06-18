const transactionRepository = require("../repositories/transactionRepository");

module.exports = {

    async create(req) { 
        const {flight_id, amount, passenger} = req.body;

        console.log(flight_id,amount,passenger)
    
    },
}
