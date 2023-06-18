const transactionRepository = require("../repositories/transactionRepository");
const {generateCode} = require("../../utils/transaction");
const flightRepository = require("../repositories/flightRepository");

module.exports = {

    async create(req) { 
        const user = req.user;
        const {flight_id, amount, passenger} = req.body;
        const transaction_code = generateCode()
        let flight_type;
        const flight= [];
        const date= new Date();
        const bookCodeTransaction = []


        if (flight_id.length === 2) {
            for (let i = 0; i < flight_id.length; i++) {
                flight.push(flight_id[i]);
            }
            flight_type = "Two Way";
        }else{
            flight.push(flight_id[0]);
            flight_type = "One Way";
        }

        const newTransaction = await transactionRepository.create({
            flight_id: flight,
            user_id: user.id,
            amount,
            transaction_code,
            flight_type,
            transaction_date: date,
            transaction_status: 'issued'
        })

        for (let i = 0; i < passenger.length; i++) {
            const bookPassenger = await transactionRepository.createPassenger({
                transaction_id: newTransaction.id,
                transactionCode: newTransaction.transaction_code,
                type: passenger[i].type,
                title: passenger[i].title,
                name: passenger[i].name,
                family_name: passenger[i].family_name,
                birthday: passenger[i].birthday,
                nationality: passenger[i].nationality,
                nik_paspor: passenger[i].nik,
                seat: passenger[i].seat
            })
            bookCodeTransaction.push(bookPassenger)
        }

        const getDataFlight = await flightRepository.findFlight(flight[0])
        const getDataFlightDua = await flightRepository.findFlight(flight[1])

        if (flight.length === 2) {
            return {
                status: "Ok",
                message: "Data succesfuly created",
                data: {
                    transaction: newTransaction, 
                    berangkat: getDataFlight,
                    pulang: getDataFlightDua,
                    dataPassenger: bookCodeTransaction
                }
            }
        }else{
            return {
                status: "Ok",
                message: "Data succesfuly created",
                data: {
                    transaction: newTransaction, 
                    berangkat: getDataFlight,
                    pulang: [],
                    dataPassenger: bookCodeTransaction
                }
            }
        }


    
    },
}
