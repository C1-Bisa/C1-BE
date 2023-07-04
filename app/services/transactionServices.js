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
    
    async printTicket(req){
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
                        <div style=" display: block; max-width: 900px;margin-left: 15%; margin-right: 15%;">
                          <div style="text-align: left; margin: 0 auto; max-width: 600px;">
                                <h1 style="font-size: 20px; margin-top: 20px; text-align: center;">BOARDING PASS</h1>
                                <h1 style="font-size: 16px; text-align: center;">FlyId Airways</h1>
                                <table border="0">
                                    <tr style="text-align: start;">
                                        <th colspan="2">
                                        <h1 style="font-size: 14px; margin-top: 20px; text-align: start;">BOOKING CODE: <br> ${getTransactionPass.transaction_code}</h1>
                                        </th>
                                        <th style="padding-left:210px; text-align:start;">Nama:<br>Phone:<br>Email:</th>
                                        <th style="text-align: start; padding-left: 60px;"> 
                                        ${user.nama}<br>${user.phone}<br>${user.email}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th> <img src="https://i.imgur.com/s9TDG2k.png" alt="" width="100px">
                                        </th>
                                    </tr>
                                </table>
                                
                                <div style="margin-top: 20px; margin-buttom:0px;  color:#00AD10; font-size:16px;">
                                    <p style="font-weight: 700">Departure Flight</p>
                                </div>
        
                                <table  style="text-align: center; width:100%; border: 5px; cellpadding: 0; cellspacing:0; margin-left: auto; margin-right: auto; border-collapse: collapse; ">
                        
                                    <!-- start copy block --> 
                                    <tr class="font" align="center" valign="top"  style="padding: 36px 24px; font-weight:700; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px; background-color: #d1cece; border-bottom: 3px solid #edebeb; text-align: start; ">
                                        <td style="padding: 10px;">Airline</td>
                                        <td style="padding: 10px;">Type</td>
                                        <td style="padding: 10px;">Departure</td>
                                        <td style="padding: 10px;">Arrival</td>
                                    </tr>
                                    <tr  style="padding:1rem; font-weight:200; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px;background-color: #eae8e8; text-align: start; ">
                                        <td style="padding: 10px;">${departureFlight.Flight.Airline.airline_name} <br>(${departureFlight.Flight.Airline.airline_code})</</td>
                                        <td style="padding: 10px;">${departureFlight.Flight.flight_class}</</td>
                                        <td style="padding: 10px;">${reformatDate(departureFlight.Flight.departure_date)} ${fixedHour(departureFlight.Flight.departure_time)} <br> ${departureFlight.Flight.Airport_from.airport_name} (${departureFlight.Flight.Airport_from.airport_code}) </</td>
                                        <td style="padding: 10px;">${reformatDate(departureFlight.Flight.arrival_date)} ${fixedHour(departureFlight.Flight.arrival_time)} <br> ${departureFlight.Flight.Airport_to.airport_name} (${departureFlight.Flight.Airport_to.airport_code}) </td>
                                    </tr>
                                    <!-- end copy block -->
                                </table>
        
                                <div style="margin-top: 0px;  color:#00AD10; font-size:16px;">
                                    <p style="font-weight: 700">Detail of Passanger</p>
                                </div>
                                
                                <div style="text-align: center; widht:100%;">
                                    <table style="text-align: center; width:100%; border: 1px ; cellpadding: 0; cellspacing:0; margin-left: auto; margin-right: auto; border-collapse: collapse; margin-top:1rem;">
                                        <tr style="padding: 36px 24px; font-weight:700; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px; background-color: #d1cece; border-bottom: 3px solid #edebeb; text-align: start; ">
                                            <th style="text-align: start;" >No</th>
                                            <th style="text-align: start;" >Passanger</th>
                                            <th style="text-align: start;" >Identity</th>
                                            <th style="text-align: start;" >Seat</th>
                                        </tr>
                                        ${(getTransactionPass.Passengers).map((element, index) => {
                                            return `
                                                <tr key=${index} style="padding:1rem; font-weight:200; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px;background-color: #eae8e8; text-align: start; ">
                                                    <td>${index + 1}</</td>
                                                    <td>${element.name}</</td>
                                                    <td>${element.nik_paspor}</</td>
                                                    <td>${element.seatDeparture}</td>
                                                </tr>
                                                `
                                            }).join('')}
                                    </table>
                                </div>
                                <p style="font-weight:700;">Have a nice flights and Remember to always smile!</p>
                                <p>Thanks,<br> FlyId team</p>
                            </div>
                          </div> 
                        </div>
               `
            }
    
            const payloadNodemailerRoundtrip = {
                Email: user.email,
                subject: "Flight Ticket Two Way",
                html: `
                <img style="width: 100%; height: 15rem;" src="https://i.imgur.com/LG231w6.jpg"></img>
                        <div style=" display: block; max-width: 900px;margin-left: 15%; margin-right: 15%;">
                          <div style="text-align: left; margin: 0 auto; max-width: 600px;">
                                <h1 style="font-size: 20px; margin-top: 20px; text-align: center;">BOARDING PASS</h1>
                                <h1 style="font-size: 16px; text-align: center;">FlyId Airways</h1>
                                <table border="0">
                                        <tr style="text-align: start;">
                                            <th colspan="2">
                                            <h1 style="font-size: 14px; margin-top: 20px; text-align: start;">BOOKING CODE: <br> ${getTransactionPass.transaction_code}</h1>
                                            </th>
                                            <th style="padding-left:210px; text-align:start;">Nama:<br>Phone:<br>Email:</th>
                                            <th style="text-align: start; padding-left: 60px;"> 
                                            ${user.nama}<br>${user.phone}<br>${user.email}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th> <img src="https://i.imgur.com/s9TDG2k.png" alt="" width="100px">
                                            </th>
                                        </tr>
                                </table>                                
                                <div style="margin-top: 20px; margin-buttom:0px;  color:#00AD10; font-size:16px;">
                                    <p style="font-weight: 700">Departure Flight</p>
                                </div>
        
                                <table  style="text-align: center; width:100%; border: 5px; cellpadding: 0; cellspacing:0; margin-left: auto; margin-right: auto; border-collapse: collapse; ">
                        
                                    <!-- start copy block --> 
                                    <tr class="font" align="center" valign="top"  style="padding: 36px 24px; font-weight:700; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px; background-color: #d1cece; border-bottom: 3px solid #edebeb; text-align: start; ">
                                        <td style="padding: 10px;">Airline</td>
                                        <td style="padding: 10px;">Type</td>
                                        <td style="padding: 10px;">Departure</td>
                                        <td style="padding: 10px;">Arrival</td>
                                    </tr>
                                    <tr  style="padding:1rem; font-weight:200; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px;background-color: #eae8e8; text-align: start; ">
                                        <td style="padding: 10px;">${departureFlight.Flight.Airline.airline_name} <br> (${departureFlight.Flight.Airline.airline_code})</</td>
                                        <td style="padding: 10px;">${departureFlight.Flight.flight_class}</</td>
                                        <td style="padding: 10px;">${reformatDate(departureFlight.Flight.departure_date)} ${fixedHour(departureFlight.Flight.departure_time)} <br> ${departureFlight.Flight.Airport_from.airport_name} (${departureFlight.Flight.Airport_from.airport_code}) </</td>
                                        <td style="padding: 10px;">${reformatDate(departureFlight.Flight.arrival_date)} ${fixedHour(departureFlight.Flight.arrival_time)} <br> ${departureFlight.Flight.Airport_to.airport_name} (${departureFlight.Flight.Airport_to.airport_code}) </td>
                                    </tr>
                                    <!-- end copy block -->
                                </table>
        
                                <div style="margin-top: 0px;  color:#00AD10; font-size:16px;">
                                    <p style="font-weight: 700">Detail of Passanger</p>
                                </div>
                                
                                <div style="text-align: center; widht:100%;">
                                    <table style="text-align: center; width:100%; border: 1px ; cellpadding: 0; cellspacing:0; margin-left: auto; margin-right: auto; border-collapse: collapse; margin-top:1rem;">
                                        <tr style="padding: 36px 24px; font-weight:700; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px; background-color: #d1cece; border-bottom: 3px solid #edebeb; text-align: start; ">
                                            <th style="text-align:start;" >No</th>
                                            <th style="text-align:start;" >Passanger</th>
                                            <th style="text-align:start;" >Identity</th>
                                            <th style="text-align:start;" >Seat</th>
                                        </tr>
                                        ${(getTransactionPass.Passengers).map((element, index) => {
                                            return `
                                                <tr key=${index} style="padding:1rem; font-weight:200; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px;background-color: #eae8e8; text-align: start; ">
                                                    <td>${index + 1}</</td>
                                                    <td>${element.name}</</td>
                                                    <td>${element.nik_paspor}</</td>
                                                    <td>${element.seatDeparture}</td>
                                                </tr>
                                                `
                                            }).join('')}
                                    </table>
                                </div>
        
                                <div style="text-align: center; margin-top:10px;">
                                    <img style="width: 8rem; height: 4rem;" src="https://i.imgur.com/yC1odNq.png"></img>
                                </div>
        
                                <div style="margin-top: 10px; margin-buttom:0px;  color:#00AD10; font-size:16px;">
                                    <p style="font-weight: 700">Arrival Flight</p>
                                </div>
        
                                <table  style="text-align: center; width:100%; border: 5px; cellpadding: 0; cellspacing:0; margin-left: auto; margin-right: auto; border-collapse: collapse; ">
                                    
                                    <!-- start copy block --> 
                                    <tr class="font" align="center" valign="top"  style="padding: 36px 24px; font-weight:700; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px; background-color: #d1cece; border-bottom: 3px solid #edebeb; text-align: start; ">
                                        <td style="padding: 10px;">Airline</td>
                                        <td style="padding: 10px;">Type</td>
                                        <td style="padding: 10px;">Departure</td>
                                        <td style="padding: 10px;">Arrival</td>
                                    </tr>
                                    <tr  style="padding:1rem; font-weight:200; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px;background-color: #eae8e8; text-align: start; ">
                                        <td style="padding: 10px;"> ${arrivalFlight.Flight?.Airline.airline_name} <br> (${arrivalFlight.Flight?.Airline.airline_code})</</td>
                                        <td style="padding: 10px;">${arrivalFlight.Flight?.flight_class}</</td>
                                        <td style="padding: 10px;">${arrivalFlight.Flight && reformatDate(arrivalFlight.Flight?.departure_date)} ${arrivalFlight.Flight && fixedHour(arrivalFlight.Flight?.departure_time)}<br> ${arrivalFlight.Flight?.Airport_from.airport_name} (${arrivalFlight.Flight?.Airport_from.airport_code}) </</td>
                                        <td style="padding: 10px;">${arrivalFlight.Flight && reformatDate(arrivalFlight.Flight?.arrival_date)} ${arrivalFlight.Flight && fixedHour(arrivalFlight.Flight?.arrival_time)} <br> ${arrivalFlight.Flight?.Airport_to.airport_name} (${arrivalFlight.Flight?.Airport_to.airport_code}) </td>
                                    </tr>
                                    <!-- end copy block -->
                                </table>
        
                                <div style="margin-top: 0px;  color:#00AD10; font-size:16px;">
                                        <p style="font-weight: 700">Detail of Passanger</p>
                                </div>
        
                                <div style="widht:100%;">
                                    <table style="text-align: center; width:100%; border: 1px ; cellpadding: 0; cellspacing:0; margin-left: auto; margin-right: auto; border-collapse: collapse; ">
                                        <tr style="padding: 36px 24px; font-weight:700; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px; background-color: #d1cece; border-bottom: 3px solid #edebeb; text-align: start; ">
                                            <th style="text-align:start;" >No</th>
                                            <th style="text-align:start;" >Passanger</th>
                                            <th style="text-align:start;" >Identity</th>
                                            <th style="text-align:start;" >Seat</th>
                                        </tr>
                                        ${(getTransactionPass.Passengers).map((element, index) => {
                                            return `
                                                <tr key=${index} style="padding:1rem; font-weight:200; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 24px;background-color: #eae8e8; text-align: start; ">
                                                    <td>${index + 1}</</td>
                                                    <td>${element.name}</</td>
                                                    <td>${element.nik_paspor}</</td>
                                                    <td>${element.seatDeparture}</td>
                                                </tr>
                                                `
                                            }).join('')}
                                    </table>
                                </div>
        
                                <p style="font-weight:700;">Have a nice flights and Remember to always smile!</p>
                                <p>Thanks,<br> FlyId team</p>
                            </div>
                          </div> 
                        </div>
               `
            }
            
            if (getTransaction.length == 2) {
                sendMail(payloadNodemailerRoundtrip);
            }else{
                sendMail(payloadNodemailerOnetrip)
            }
    
              return {
                status: "Ok",
                message: "Ticket has been send to your email!",
                data: getTransactionPass
              };
        } catch (error) {
            throw error
        }
    }
}
