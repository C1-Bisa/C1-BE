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

    // async create(req) { 
    //     const user = req.user;
    //     const {flight_id, amount, passenger} = req.body;
    //     const transaction_code = generateCode()
    //     let flight_type;
    //     const flight= [];
    //     const date= new Date();
    //     const bookCodeTransaction = []

    //     if (flight_id.length === 2) {
    //         for (let i = 0; i < flight_id.length; i++) {
    //             flight.push(flight_id[i]);
    //         }
    //         flight_type = "Two Way";
    //     }else{
    //         flight.push(flight_id[0]);
    //         flight_type = "One Way";
    //     }

    //     const newTransaction = await transactionRepository.create({
    //         flight_id: flight,
    //         user_id: user.id,
    //         amount,
    //         transaction_code,
    //         flight_type,
    //         transaction_date: date,
    //         transaction_status: 'Unpaid'
    //     })

    //     for (let i = 0; i < passenger.length; i++) {
    //         const bookPassenger = await transactionRepository.createPassenger({
    //             transaction_id: newTransaction.id,
    //             transactionCode: newTransaction.transaction_code,
    //             type: passenger[i].type,
    //             title: passenger[i].title,
    //             name: passenger[i].name,
    //             family_name: passenger[i].family_name,
    //             birthday: passenger[i].birthday,
    //             nationality: passenger[i].nationality,
    //             nik_paspor: passenger[i].nik,
    //             seat: passenger[i].seat
    //         })
    //         bookCodeTransaction.push(bookPassenger)
    //     }

        

    //     await notificationRepository.create({
    //         headNotif: "Pemesanan tiket",
    //         message: "Segera lakukan pembayaran  untuk menyelesaikan proses transaksi",
    //         userId: user.id,
    //         isRead: false
    //     });

    //     const getDataFlight = await flightRepository.findFlight(flight[0])
    //     const getDataFlightDua = await flightRepository.findFlight(flight[1])

    //     if (flight.length === 2) {
    //         return {
    //             status: "Ok",
    //             message: "Data succesfuly created",
    //             data: {
    //                 transaction: newTransaction, 
    //                 berangkat: getDataFlight,
    //                 pulang: getDataFlightDua,
    //                 dataPassenger: bookCodeTransaction,
    //             }
    //         }
    //     }else{
    //         return {
    //             status: "Ok",
    //             message: "Data succesfuly created",
    //             data: {
    //                 transaction: newTransaction, 
    //                 berangkat: getDataFlight,
    //                 pulang: [],
    //                 dataPassenger: bookCodeTransaction,

    //             }
    //         }
    //     }
    // },

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
                    transaction: findPassenger,
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

    // async history(req) { 
    //     id = req.user.id;
    //     const getAllHistory = await transactionRepository.findAll(id);
    //     const arrayDataTransaction = [];
    //     const arrayFlightDeparture = [];
    //     const arrayFlightReturn = [];
    
    //     const data = getAllHistory.map(detail => arrayDataTransaction.push({
    //         transaction_id: detail.id,
    //         transaction_code: detail.transaction_code,
    //         flight_id: detail.flight_id,
    //         user_id: detail.user_id,
    //         amount: detail.amount,
    //         transaction_status: detail.transaction_status,
    //         transaction_date: detail.transaction_date,
    //         flight_type: detail.flight_type,
    //         passenger: detail.passengers
    //     }));

    //     for (let i = 0; i < arrayDataTransaction.length; i++) {
    //         if (arrayDataTransaction[i].flight_id.length === 2) {
    //             const getDataFlight = await flightRepository.findTicketFilter(arrayDataTransaction[i].flight_id[0])
    //             const getDataFlightDua = await flightRepository.findTicketFilter(arrayDataTransaction[i].flight_id[1])

    //             arrayFlightDeparture.push(getDataFlight);
    //             arrayFlightReturn.push(getDataFlightDua);

    //         }else{
    //             const getDataFlight = await flightRepository.findTicketFilter(arrayDataTransaction[i].flight_id[0])
    //             arrayFlightDeparture.push(getDataFlight); 
    //         }
    //     }

    //     let dataDetailTransaction = arrayDataTransaction.map((obj, index) => ({
    //         ...obj,
    //         flight_departure: arrayFlightDeparture[index],
    //         flight_return: arrayFlightReturn[index]
    //       }));

    //       return {
    //         status: "Ok",
    //         message: "Data succesfuly get",
    //         data: dataDetailTransaction
    //     }
    // },
    
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

    async createTransaction(req){
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

            const findPassenger = await transactionRepository.findPassenger(newTransaction.id);
        
            const departureFlight = await transactionRepository.getTransactionFlight(newTransaction.id)

            const arrivalFlight = arrivalFlights.length > 0? await transactionRepository.getTransactionFlight(newTransaction.id) : []

            const data = {
              status: "Ok",
              message: "Data successfully created",
              data: {
                transaction: findPassenger,
                departure: departureFlight,
                arrival: arrivalFlight,
              }
            };
        
            return data;
                  
        }catch(error){
            throw error

        }
    },
    
    async transactionPrint(req){
        try {
            const user = req.user;
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

            

            const payloadNodemailerOnetrip = {
                Email: user.email,
                subject: "Flight Ticket One Way",
                html: `
                <img style="width: 100%; height: 15rem;" src="https://i.imgur.com/LG231w6.jpg"></img>
                <div style="text-align:center;  display: block; max-width: 900px;margin-left: 15%; margin-right: 15%;">
                  <div style="text-align: left; margin: 0 auto; max-width: 600px;">
                        <h1 style="font-size: 20px; margin-top: 20px; text-align: center;">BOARDING PASS</h1>
                        <h1 style="font-size: 16px; text-align: center;">FlyId Airways</h1>
                        <h1 style="font-size: 16px; margin-top: 20px; text-align: start;">BOOKING CODE: <br>${findPassenger.transaction_code}</h1>
                        <h1 style="font-size: 20px; text-align: start;">
                            ${departureFlight.Flight.from}
                        </h1>
                        <div style="text-align: center;">
                            <img style="width: 8rem; height: 4rem;" src="https://i.imgur.com/yC1odNq.png"></img>
                        </div>
                        <h1 style="font-size: 20px;  text-align: end;">
                            ${departureFlight.Flight.to}
                        </h1>
                    <div style="text-align: center; widht:100%;">
                          <a style="
                          font-size:18px;
                          text-align:center; 
                          font-weight: 900; 
                          background: #17594A; 
                          border-radius: 10px; 
                          padding:0.5rem; 
                          color:white;
                          border:none;
                          widht: 100%;
                          ">NAME OF PASSENGER:</a>
                        ${(findPassenger.Passengers).map((element, index) => {
                            return `
                            <div>
                                <p style="font-size: 16px;" key=${index}>${index+1}. ${element.name}</p>
                            </div>
                            `
                        }).join('')}
                        <h1 style="font-size: 16px; font-weight: 900; margin-top: 1rem; background: #17594A; 
                        border-radius: 10px; 
                        padding:0.5rem; 
                        color:white; widht: 100%;">
                           SEAT:
                        </h1>
                        ${(findPassenger.Passengers).map((element, index) => {
                            return `
                                <span style="font-size: 16px; font-weight: 800;  margin-right: 2rem;  background: #17594A; 
                                border-radius: 10px; 
                                padding:0.5rem; 
                                color:white; widht: 100%;">${element.seat}</span>
                            `
                        }).join('')}
                      </div>
                    <div style="display: flex; margin-top: 1rem;">
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            DATE:   <br>${reformatDate(departureFlight.Flight.departure_date)}
                        </h1>
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            BOARDING:   <br>${fixedHour(departureFlight.Flight.departure_time)}
                        </h1>
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            DEPARTURE:   <br>${fixedHour(departureFlight.Flight.arrival_time)}
                        </h1>
                    </div>
                        <p style="font-weight:700;">Have a nice flights and Remember to always smile!</p>
                        <p>Thanks,<br> FlyId team</p>
                  </div>   
                </div>`
              }

            const payloadNodemailerRoundtrip = {
                Email: user.email,
                subject: "Flight Ticket Two Way",
                html: `
                <img style="width: 100%; height: 15rem;" src="https://i.imgur.com/LG231w6.jpg"></img>
                <div style="text-align:center;  display: block; max-width: 900px;margin-left: 15%; margin-right: 15%;">
                  <div style="text-align: left; margin: 0 auto; max-width: 600px;">
                        <h1 style="font-size: 20px; margin-top: 20px; text-align: center;">BOARDING PASS</h1>
                        <h1 style="font-size: 16px; text-align: center;">FlyId Airways</h1>
                        <h1 style="font-size: 16px; margin-top: 20px; text-align: start;">BOOKING CODE: <br>${findPassenger.transaction_code}</h1>
                        <h1 style="font-size: 20px; text-align: start;">
                            ${departureFlight.Flight.from}
                        </h1>
                        <div style="text-align: center;">
                            <img style="width: 8rem; height: 4rem;" src="https://i.imgur.com/yC1odNq.png"></img>
                        </div>
                        <h1 style="font-size: 20px;  text-align: end;">
                            ${departureFlight.Flight.to}
                        </h1>
                    <div style="text-align: center; widht:100%;">
                          <a style="
                          font-size:18px;
                          text-align:center; 
                          font-weight: 900; 
                          background: #17594A; 
                          border-radius: 10px; 
                          padding:0.5rem; 
                          color:white;
                          border:none;
                          ">NAME OF PASSENGER:</a>
                        ${(findPassenger.Passengers).map((element, index) => {
                            return `
                            <div>
                                <p style="font-size: 16px;" key=${index}>${index+1}. ${element.name}</p>
                            </div>
                            `
                        }).join('')}
                        <h1 style="font-size: 16px; font-weight: 900; margin-top: 1rem; background: #17594A; 
                        border-radius: 10px; 
                        padding:0.5rem; 
                        color:white; widht: 100%;">
                           SEAT:
                        </h1>
                        ${(findPassenger.Passengers).map((element, index) => {
                            return `
                                <span style="font-size: 16px; font-weight: 800;  margin-right: 2rem;  background: #17594A; 
                                border-radius: 10px; 
                                padding:0.5rem; 
                                color:white; widht: 100%;">${element.seat}</span>
                            `
                        }).join('')}
                      </div>
                    <h1 style="font-size: 15px; margin-top: 1rem;">
                      Departure
                    </h1>
                    <div style="display: flex;">
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            DATE:   <br>${reformatDate(departureFlight.Flight.departure_date)}
                        </h1>
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            BOARDING:   <br>${fixedHour(departureFlight.Flight.departure_time)}
                        </h1>
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            DEPARTURE:   <br>${fixedHour(departureFlight.Flight.arrival_time)}
                        </h1>
                    </div>
                    <br>
                    <h1 style="font-size: 20px; text-align: end;">
                            ${arrivalFlight.Flight?.from}
                        </h1>
                        <div style="text-align: center;">
                            <img style="width: 8rem; height: 4rem; transform: scaleX(-1);" src="https://i.imgur.com/yC1odNq.png"></img>
                        </div>
                        <h1 style="font-size: 20px;  text-align: start;">
                            ${arrivalFlight.Flight?.to}
                        </h1>
                        <h1 style="font-size: 15px;">
                            Arrival
                        </h1>
                    <div style="display: flex;">
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            DATE:   <br>${arrivalFlight.Flight && reformatDate(arrivalFlight.Flight?.departure_date)}
                        </h1>
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            BOARDING:   <br>${arrivalFlight.Flight && fixedHour(arrivalFlight.Flight?.departure_time)}
                        </h1>
                        <h1 style="font-size: 12px; margin-right: 7rem;">
                            DEPARTURE:   <br>${arrivalFlight.Flight && fixedHour(arrivalFlight.Flight?.arrival_time)}
                        </h1>
                    </div>
                        <p style="font-weight:700;">Have a nice flights and Remember to always smile!</p>
                        <p>Thanks,<br> FlyId team</p>
                  </div>   
                </div>`
              }

           
            if (getTransaction.length == 2) {
                sendMail(payloadNodemailerRoundtrip);
            }else{
                sendMail(payloadNodemailerOnetrip);
            }

              return {
                status: "Ok",
                message: "Ticket has been send to your email!",
                data: findPassenger
              };
        } catch (error) {
            throw error
        }
    }
}
