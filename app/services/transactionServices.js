const transactionRepository = require("../repositories/transactionRepository");
const {generateCode} = require("../../utils/transaction");
const {sendMail} = require("../../utils/email");
const flightRepository = require("../repositories/flightRepository");
const notificationRepository = require("../repositories/notificationRepository");
const {Flight} = require("../../app/models")

const fixedHour = (hours) => {
    let arrOfHours = hours.split(':');
    let arr = [];
    while (arr.length < 2) {
        arr.push(arrOfHours[arr.length]);
    }
    return arr.join(':');
};

const reformatDate = (date, option = { day: 'numeric', month: 'long', year: 'numeric' }, country = 'id') =>
    new Date(date).toLocaleString(country, option);

module.exports = {

    async update(req){
        try{
            const user = req.user
            const {transaction_code} =  req.body

            if(!transaction_code){
                return{
                    status: "FAILED",
                    message: "Transaction code not found",
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

    async getById(req){
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
            const getTransactionPass = await transactionRepository.getTransactionPass(transaction_id);
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

            for (let i = 0; i < getTransactionPass.Passengers.length; i++) {
                typePassenger.push(getTransactionPass.Passengers[i].type)
            }

            let adult = 0;
            let child = 0;
            let baby = 0;

            for (let i = 0; i < typePassenger.length; i++) {
                if (typePassenger[i] == "Adult") {
                    adult = adult + 1;
                }
                if (typePassenger[i] == "Child") {
                    child = child + 1;
                }
                if (typePassenger[i] == "Baby") {
                    baby = baby + 1;
                }
            }


            return {
                status: "Ok",
                message: "Data successfully Get",
                data: {
                    transaction: getTransactionPass,
                    departure: departureFlight,
                    arrival: arrivalFlight,
                    passenger: {adult: adult, child:child, baby:baby},
                    price:{departure: departurePrice, arrival: arrivalPrice, totalPrice: totalPrice, tax: tax}
                }
              };
        }catch(error){
            throw error
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
            const baby = []

            for (let i = 0; i < typePassenger.length; i++) {
                let adultCount = 0;
                let childCount = 0;
                let babyCount = 0;
                for (let j = 0; j < typePassenger[i].length; j++) {
                    if (typePassenger[i][j] == "Adult") {
                        adultCount = adultCount + 1;
                    }
                    if (typePassenger[i][j] == "Child") {
                        childCount = childCount + 1;
                    }
                    if (typePassenger[i][j] == "Baby") {
                        babyCount = babyCount + 1;
                    }
                }
                adult.push(adultCount)
                child.push(childCount)
                baby.push(babyCount)
            }


            let coreData = arrayDataPassenger.map((obj, index) => ({
                transaction: obj,
                type_passenger: {adult: adult[index], child: child[index], baby: baby[index]},
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

    async create(req){
        try{
            const user = req.user;
            const {flights, passenger,amount} = req.body;
            const transaction_code = generateCode()
            const date= new Date();

            if(!amount){
                return{
                    status: "FAILED",
                    message: "data amount must filled",
                    data: null
                }
            }

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

            const departureFlightId = await Flight.findByPk(departureFlights[0].flight_id);
            const arrivalFlightId = arrivalFlights.length > 0? await Flight.findByPk(arrivalFlights[0].flight_id) : null;


            const departure= await newTransaction.addFlight(departureFlightId, { through: { transaction_type: 'Departure' } });

            const arrival=  arrivalFlights.length > 0? await newTransaction.addFlight(arrivalFlightId, { through: { transaction_type: 'Arrival' } }): []


            if(arrivalFlights.length > 0){
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
                        seatDeparture: passenger[i].seatDeparture,
                        seatReturn: passenger[i].seatReturn
                    })
                }
            }else{
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
                        seatDeparture: passenger[i].seatDeparture,
                    })
                }
            }
            

            await notificationRepository.create({
                headNotif: "Pemesanan tiket",
                message: "Segera lakukan pembayaran  untuk menyelesaikan proses transaksi",
                userId: user.id,
                isRead: false
            });

            const getTransactionPass = await transactionRepository.getTransactionPass(newTransaction.id);
        
            const departureFlight = await transactionRepository.getTransactionFlight(newTransaction.id)

            const arrivalFlight = arrivalFlights.length > 0? await transactionRepository.getTransactionFlight(newTransaction.id) : []

            const data = {
              status: "Ok",
              message: "Data successfully created",
              data: {
                transaction: getTransactionPass,
                departure: departureFlight,
                arrival: arrivalFlight,
              }
            };
        
            return data;
                  
        }catch(error){
            throw error

        }
    },

   

}
