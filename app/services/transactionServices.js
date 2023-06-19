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

    async history(req) { 
        id = req.user.id;
        const getAllHistory = await transactionRepository.findAll(id);
        const arrayDataTransaction = [];
        const arrayFlightDeparture = [];
        const arrayFlightReturn = [];
        // const arrayPassenger = [];

    
    
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
//departure
//return

                arrayFlightDeparture.push(getDataFlight);
                arrayFlightReturn.push(getDataFlightDua);
                // const filter = getDataFlight.map(schedule => arrayFlightDeparture.push({
                //     flight_id: schedule.id,
                //     airline_id: schedule.airline_id,
                //     airline: schedule.Airline.airline_name,
                //     airlane_code: schedule.Airline.airline_code,
                //     airport_id_from: schedule.airport_id_from,
                //     from: schedule.from,
                //     airport_from_code: schedule.Airport_from.airport_code,
                //     airport_from: schedule.Airport_from.airport_name,
                //     airport_id_to: schedule.airport_id_to,
                //     to: schedule.to,
                //     airport_to_code: schedule.Airport_to.airport_code,
                //     airport_to: schedule.Airport_to.airport_name,
                //     departure_date: schedule.departure_date,
                //     departure_time: schedule.departure_time,
                //     arrival_date: schedule.arrival_date,
                //     arrival_time: schedule.arrival_time,
                //     duration: schedule.duration,
                //     price: schedule.price,
                //     flight_class: schedule.flight_class,
                //     description: schedule.description,
                // }));

                // const filtertwo = getDataFlightDua.map(schedule => arrayFlightReturn.push({
                //     flight_id_return: schedule.id,
                //     airline_id_return: schedule.airline_id,
                //     airline_return: schedule.Airline.airline_name,
                //     airlane_code_return: schedule.Airline.airline_code,
                //     airport_id_from_return: schedule.airport_id_from,
                //     from_return: schedule.from,
                //     airport_from_code_return: schedule.Airport_from.airport_code,
                //     airport_from_return: schedule.Airport_from.airport_name,
                //     airport_id_to_return: schedule.airport_id_to,
                //     to_return: schedule.to,
                //     airport_to_code_return: schedule.Airport_to.airport_code,
                //     airport_to_return: schedule.Airport_to.airport_name,
                //     departure_date_return: schedule.departure_date,
                //     departure_time_return: schedule.departure_time,
                //     arrival_date_return: schedule.arrival_date,
                //     arrival_time_return: schedule.arrival_time,
                //     duration_return: schedule.duration,
                //     price_return: schedule.price,
                //     flight_class_return: schedule.flight_class,
                //     description_return: schedule.description,
                // }));



            }else{
                const getDataFlight = await flightRepository.findTicketFilter(arrayDataTransaction[i].flight_id[0])
                arrayFlightDeparture.push(getDataFlight);
                // const filter = getDataFlight.map(schedule => arrayFlightDeparture.push({
                //     flight_id: schedule.id,
                //     airline_id: schedule.airline_id,
                //     airline: schedule.Airline.airline_name,
                //     airlane_code: schedule.Airline.airline_code,
                //     airport_id_from: schedule.airport_id_from,
                //     from: schedule.from,
                //     airport_from_code: schedule.Airport_from.airport_code,
                //     airport_from: schedule.Airport_from.airport_name,
                //     airport_id_to: schedule.airport_id_to,
                //     to: schedule.to,
                //     airport_to_code: schedule.Airport_to.airport_code,
                //     airport_to: schedule.Airport_to.airport_name,
                //     departure_date: schedule.departure_date,
                //     departure_time: schedule.departure_time,
                //     arrival_date: schedule.arrival_date,
                //     arrival_time: schedule.arrival_time,
                //     duration: schedule.duration,
                //     price: schedule.price,
                //     flight_class: schedule.flight_class,
                //     description: schedule.description,
                // }));
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
}
