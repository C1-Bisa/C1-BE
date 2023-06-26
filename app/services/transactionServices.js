const transactionRepository = require("../repositories/transactionRepository");
const {generateCode} = require("../../utils/transaction");
const flightRepository = require("../repositories/flightRepository");
const notificationRepository = require("../repositories/notificationRepository");
const {Flight} = require("../../app/models")


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

            const dataTransaction = await transactionRepository.findById(transaction_code);

            if(!dataTransaction){
                return{
                    status: "FAIL",
                    message: "Data transaksi tidak ditemukan",
                    data: null
                }
            }

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
            throw error
        }

    },

    // async transactionById(req){
    //     try{
    //         const user = req.user.id
    //         const {transaction_id} =  req.body
    //         const typePassenger = [];

    //         const getTransaction = await transactionRepository.getTransactionFlight(transaction_id);
    //         if (!getTransaction) {
    //             return {
    //                 status: "FAIL",
    //                 message: "Data Failed Displayed",
    //                 data: null
    //               };
    //         }
    //         const findPassenger = await transactionRepository.findPassenger(transaction_id);
    //         const totalPrice = getTransaction[0].Transaction.amount;
    //         const tax = totalPrice * 0.1

    //         let departureFlight;
    //         let arrivalFlight;
    //         let departurePrice;
    //         let arrivalPrice;

    //         if (getTransaction.length == 2) {
    //             departureFlight = getTransaction[0]
    //             arrivalFlight = getTransaction[1]
    //             departurePrice = getTransaction[0].Flight.price
    //             arrivalPrice = getTransaction[1].Flight.price
    //         }else{
    //             departureFlight = getTransaction[0]
    //             arrivalFlight = {};
    //             departurePrice = getTransaction[0].Flight.price
    //         }

    //         for (let i = 0; i < findPassenger.Passengers.length; i++) {
    //             typePassenger.push(findPassenger.Passengers[i].type)
    //         }

    //         let adult;
    //         let child;

    //         for (let i = 0; i < typePassenger.length; i++) {
    //             let adultCount = 0;
    //             let childCount = 0;
    //             if (typePassenger[i] == "Adult") {
    //                 adultCount = adultCount + 1;
    //             }
    //             if (typePassenger[i] == "Child") {
    //                 childCount = childCount + 1;
    //             }
    //             adult = adultCount
    //             child = childCount
    //         }


    //         return {
    //             status: "Ok",
    //             message: "Data successfully Get",
    //             data: {
    //                 transaction: findPassenger,
    //                 departure: departureFlight,
    //                 arrival: arrivalFlight,
    //                 passenger: {adult: adult, child:child},
    //                 price:{departure: departurePrice, arrival: arrivalPrice, totalPrice: totalPrice, tax: tax}
    //             }
    //           };
    //     }catch(error){
    //         throw error
    //     }

    // },

    async transactionById(req){
        try{
            const user = req.user.id
            const {transaction_id} =  req.body
            const typePassenger = [];

            const getTransaction = await transactionRepository.getTransactionFlight(transaction_id);
            if (getTransaction.length < 1) {
                return {
                    status: "FAIL",
                    message: "Data Failed Displayed",
                    data: null
                  };
            }
            const findPassenger = await transactionRepository.findPassenger(transaction_id);
            const totalPrice = getTransaction[0].Transaction.amount;
            const tax = totalPrice * 0.1

            let departureFlight;
            let arrivalFlight;
            let departurePrice;
            let arrivalPrice;

            if (getTransaction.length == 2) {
                departureFlight = getTransaction[0]
                arrivalFlight = getTransaction[1]
                departurePrice = getTransaction[0].Flight.price
                arrivalPrice = getTransaction[1].Flight.price
            }else{
                departureFlight = getTransaction[0]
                arrivalFlight = {};
                departurePrice = getTransaction[0].Flight.price
            }

            for (let i = 0; i < findPassenger.Passengers.length; i++) {
                typePassenger.push(findPassenger.Passengers[i].type)
            }

            let adult = 0;
            let child = 0;

            for (let i = 0; i < typePassenger.length; i++) {
                if (typePassenger[i] == "Adult") {
                    adult = adult + 1;
                }
                if (typePassenger[i] == "Child") {
                    child = child + 1;
                }
            }


            return {
                status: "Ok",
                message: "Data successfully Get",
                data: {
                    transaction: findPassenger,
                    departure: departureFlight,
                    arrival: arrivalFlight,
                    passenger: {adult: adult, child:child},
                    price:{departure: departurePrice, arrival: arrivalPrice, totalPrice: totalPrice, tax: tax}
                }
              };
        }catch(error){
            throw error
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
    
    async transactionHistory(req) {
        try{
            const user = req.user.id;
            //find transaction id
            const getAllHistory = await transactionRepository.findAll(user);
            const arrayDataPassenger = [];
            arrayDataPassenger.push(...getAllHistory);
            const typePassenger = [];
            const pricePassengerDeparture = [];
            const pricePassengerArrival = [];
            const totalPricePassenger = [];
            const taxPassenger = [];
    
            for (let i = 0; i < arrayDataPassenger.length; i++) {
                const objectPassenger = [];
                for (let j = 0; j < arrayDataPassenger[i].Passengers.length; j++) {
                    objectPassenger.push(arrayDataPassenger[i].Passengers[j].type)
                }
                typePassenger.push(objectPassenger)
            }
            
            for (let i = 0; i < arrayDataPassenger.length; i++) {
                let objectPricedeparture;
                let objectPricearrival ;
                if (arrayDataPassenger[i].Flights.length === 2) {
                    // for (let j = 0; j < arrayDataPassenger[i].flight_departure.length; j++) {
                        objectPricedeparture = arrayDataPassenger[i].Flights[0].price
                    // }
                    // for (let k = 0; k < arrayDataPassenger[i].flight_return.length; k++) {
                        objectPricearrival = arrayDataPassenger[i].Flights[1].price
                    // }
                }else{
                    // for (let j = 0; j < arrayDataPassenger[i].flight_departure.length; j++) {
                        objectPricedeparture = arrayDataPassenger[i].Flights[0].price
                    // }
                }
                let tax = 0.1 * arrayDataPassenger[i].amount;

                taxPassenger.push(tax)
                totalPricePassenger.push(arrayDataPassenger[i].amount)
                pricePassengerDeparture.push(objectPricedeparture);
                pricePassengerArrival.push(objectPricearrival);
            }

            const adult = [];
            const child = [];

            for (let i = 0; i < typePassenger.length; i++) {
                let adultCount = 0;
                let childCount = 0;
                for (let j = 0; j < typePassenger[i].length; j++) {
                    if (typePassenger[i][j] == "Adult") {
                        adultCount = adultCount + 1;
                    }
                    if (typePassenger[i][j] == "Child") {
                        childCount = childCount + 1;
                    }
                }
                adult.push(adultCount)
                child.push(childCount)
            }


            let coreData = arrayDataPassenger.map((obj, index) => ({
                transaction: obj,
                type_passenger: {adult: adult[index], child: child[index]},
                price: {departure: pricePassengerDeparture[index], arrival: pricePassengerArrival[index], tax: taxPassenger[index], total:totalPricePassenger[index]}
            }));
            
            return{
                status: "Ok",
                message: "History Transaction",
                data: coreData
            }

        }catch(error){
            throw error
        }
    },

    async createTransaction(req){
        try{
            const user = req.user;
            const {flights, passenger,amount} = req.body;
            const transaction_code = generateCode()
            const date= new Date();

            const newTransaction = await transactionRepository.create({
                user_id: user.id,
                amount,
                transaction_code,
                transaction_date: date,
                transaction_status: 'Unpaid'
            })

            // Mengecek transaction_type deprature/arrival
            const departureFlights = [...flights].filter((data)=>data.flight_type == 'Departure');
            const arrivalFlights = [...flights].filter((data)=>data.flight_type == 'Arrival');

            console.log(departureFlights);
            console.log(departureFlights[0].flight_id);

            const departureFlightId = await Flight.findByPk(departureFlights[0].flight_id);
            const arrivalFlightId = arrivalFlights.length > 0? await Flight.findByPk(arrivalFlights[0].flight_id) : null;


            const departure= await newTransaction.addFlight(departureFlightId, { through: { transaction_type: 'Departure' } });

            const arrival=  arrivalFlights.length > 0? await newTransaction.addFlight(arrivalFlightId, { through: { transaction_type: 'Arrival' } }): []

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
            }

            await notificationRepository.create({
                headNotif: "Pemesanan tiket",
                message: "Segera lakukan pembayaran  untuk menyelesaikan proses transaksi",
                userId: user.id,
                isRead: false
            });

            const transaction = await transactionRepository.findPassenger(newTransaction.id);
        
            const departureFlight = await transactionRepository.getTransactionFlight(newTransaction.id)

            const arrivalFlight = arrivalFlights.length > 0? await transactionRepository.getTransactionFlight(newTransaction.id) : []

            // Create notifikasi order
            await notificationRepository.create({
                headNotif: "Pemesanan tiket",
                message: "Segera lakukan pembayaran  untuk menyelesaikan proses transaksi",
                userId: user.id,
                isRead: false
            });

            const data = {
              status: "Ok",
              message: "Data successfully created",
              data: {
                transaction: transaction,
                ticket: departureFlight,
              }
            };
        
            return data;
                  
        }catch(error){
            throw error

        }
    },

    // async createTransaction(req){
    //     try{
    //         const user = req.user;
    //         const {flights, passenger,amount} = req.body;
    //         const transaction_code = generateCode()
    //         const date= new Date();

    //         const newTransaction = await transactionRepository.create({
    //             user_id: user.id,
    //             amount,
    //             transaction_code,
    //             transaction_date: date,
    //             transaction_status: 'Unpaid'
    //         })


    //         for (let i = 0; i < passenger.length; i++) {
    //             const bookPassenger = await transactionRepository.createPassenger({
    //                 transaction_id: newTransaction.id,
    //                 transactionCode: newTransaction.transaction_code,
    //                 type: passenger[i].type,
    //                 title: passenger[i].title,
    //                 name: passenger[i].name,
    //                 family_name: passenger[i].family_name,
    //                 birthday: passenger[i].birthday,
    //                 nationality: passenger[i].nationality,
    //                 nik_paspor: passenger[i].nik,
    //                 seat: passenger[i].seat
    //             })
    //         }

    //         const findPassenger = await transactionRepository.findPassenger(newTransaction.id);

    //         // Mengecek transaction_type deprature/arrival
    //         const departureFlights = [...flights].filter((data)=>data.flight_type == 'Departure');
    //         const arrivalFlights = [...flights].filter((data)=>data.flight_type == 'Arrival');

    //         // Create departure transaction_type
    //         const departureFlightId = await transactionRepository.createTransactionType(newTransaction.id,departureFlights[0].flight_id,'Departure')

    //         // Create arrival transaction_type
    //         const arrivalFlightId = arrivalFlights.length > 0? await transactionRepository.createTransactionType(newTransaction.id,arrivalFlights[0].flight_id,'Arrival'): []
        
    //         const departureFlight = await transactionRepository.getTransactionFlight(newTransaction.id)

    //         const arrivalFlight = arrivalFlights.length > 0? await transactionRepository.getTransactionFlight(newTransaction.id) : []

    //         const data = {
    //           status: "Ok",
    //           message: "Data successfully created",
    //           data: {
    //             transaction: findPassenger,
    //             departure: departureFlight,
    //             arrival: arrivalFlight,
    //           }
    //         };
        
    //         return data;
                  
    //     }catch(error){
    //         throw error

    //     }
    // },
    

}
