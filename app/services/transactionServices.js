const transactionRepository = require("../repositories/transactionRepository");
const {generateCode} = require("../../utils/transaction");
const flightRepository = require("../repositories/flightRepository");
const notificationRepository = require("../repositories/notificationRepository");

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
            transaction_status: 'Unpaid'
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

        

        await notificationRepository.create({
            headNotif: "Pemesanan tiket",
            message: "Segera lakukan pembayaran  untuk menyelesaikan proses transaksi",
            userId: user.id,
            isRead: false
        });

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
                    dataPassenger: bookCodeTransaction,
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
                    dataPassenger: bookCodeTransaction,

                }
            }
        }
    },

    async update(req){
        try{
            const user = req.user
            const {transaction_code,norek} =  req.body

            const updateTransaction =  await transactionRepository.update(user.id,transaction_code,{transaction_status:"Issued"});

            await notificationRepository.create({
                headNotif: "Payment Successfuly",
                message: "Ticket has been paid, save flight",
                userId: user.id,
                isRead: false

            })

            return{
                status: "OK",
                message: "Succesfuly paid",
                data: updateTransaction
            }

        }catch(error){

        }

    },

    async history(req) { 
        id = req.user.id;
        const getAllHistory = await transactionRepository.findAll(id);
        const arrayDataTransaction = [];
        const arrayFlightDeparture = [];
        const arrayFlightReturn = [];
    
        const data = getAllHistory.map(detail => arrayDataTransaction.push({
            transaction_id: detail.id,
            transaction_code: detail.transaction_code,
            flight_id: detail.flight_id,
            user_id: detail.user_id,
            amount: detail.amount,
            transaction_status: detail.transaction_status,
            transaction_date: detail.transaction_date,
            flight_type: detail.flight_type,
            passenger: detail.passengers
        }));

        for (let i = 0; i < arrayDataTransaction.length; i++) {
            if (arrayDataTransaction[i].flight_id.length === 2) {
                const getDataFlight = await flightRepository.findTicketFilter(arrayDataTransaction[i].flight_id[0])
                const getDataFlightDua = await flightRepository.findTicketFilter(arrayDataTransaction[i].flight_id[1])

                arrayFlightDeparture.push(getDataFlight);
                arrayFlightReturn.push(getDataFlightDua);

            }else{
                const getDataFlight = await flightRepository.findTicketFilter(arrayDataTransaction[i].flight_id[0])
                arrayFlightDeparture.push(getDataFlight); 
            }
        }

        let dataDetailTransaction = arrayDataTransaction.map((obj, index) => ({
            ...obj,
            flight_departure: arrayFlightDeparture[index],
            flight_return: arrayFlightReturn[index]
          }));

          return {
            status: "Ok",
            message: "Data succesfuly get",
            data: dataDetailTransaction
        }
    },

    async createTransaction(req){
        try{
            const user = req.user;
            const {flight_id, passenger,amount} = req.body;
            const transaction_code = generateCode()
            const date= new Date();
            const flight = []
            const bookCodeTransaction = []

            const newTransaction = await transactionRepository.create({
               
                user_id: user.id,
                amount,
                transaction_code,
                transaction_date: date,
                transaction_status: 'Unpaid'
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

            if (flight_id.length >= 2) {
                const departureFlightId = flight_id[0];
                const arrivalFlightId = flight_id[1];
          
                await transactionRepository.addTransactionFlight(newTransaction.id, departureFlightId);
                await transactionRepository.addTransactionFlight(newTransaction.id, arrivalFlightId);
              }
          
                // const departureFlight = await flightRepository.findFlight(departureFlightId);
                // const arrivalFlight = await flightRepository.findFlight(arrivalFlightId);
          
                // await transactionRepository.addTransactionFlight({
                //     flight_id:departureFlight,
                //     transaction_id:newTransaction.id 

                // });
                // await transactionRepository.addTransactionFlight({
                //     flight_id:arrivalFlight,
                //     transaction_id:newTransaction.id 

                // });

          
                console.log(departureFlightId);
                console.log(arrivalFlightId);
              

            
            // console.log(bookFlight);         
        }catch(error){
            throw error

        }
    }
}
