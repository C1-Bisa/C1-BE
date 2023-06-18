const flightRepository = require("../repositories/flightRepository");
const airlineRepository = require("../repositories/airlineRepository");


const dayjs = require("dayjs");
const { DATE } = require("sequelize");


module.exports = {
    async list() {
        try {
            const flight = await flightRepository.findAll();
            const flightCount = await flightRepository.getTotalFlight();

            return {
                data: flight,
                count: flightCount,
            };
        } catch (err) {
            throw err;
        }
    },

    async create(reqBody) {
        try {
            if (
                !reqBody.airline_id ||
                !reqBody.airport_id_from ||
                !reqBody.airport_id_to ||
                !reqBody.departure_date ||
                !reqBody.departure_time ||
                !reqBody.arrival_date ||
                !reqBody.arrival_time ||
                !reqBody.from ||
                !reqBody.to ||
                !reqBody.price ||
                !reqBody.flight_class ||
                !reqBody.description
            ) {
                return {
                    status: "Failed",
                    message: "form must be filled!",
                    data: null,
                };
            }

            const airportIdFrom = reqBody.airport_id_from;
            const airportIdTo = reqBody.airport_id_to;

            const getdataAirportFrom = await flightRepository.findAirport(airportIdFrom);
            const getdataAirportTo = await flightRepository.findAirport(airportIdTo);

            const from = reqBody.from;
            const to = reqBody.to;
            const searchFrom = await flightRepository.findLocation(from);
            const searchTo = await flightRepository.findLocation(to);

            const arivalTime = new Date(`${reqBody.arrival_date} ${reqBody.arrival_time}`);
            const departureTime = new Date(`${reqBody.departure_date} ${reqBody.departure_time}`);
            const subtractTime = arivalTime - departureTime;
            const hours = Math.floor(subtractTime / (1000 * 60 * 60));
            const minutes = Math.floor((subtractTime % (1000 * 60 * 60)) / (1000 * 60));
            
            const duration = Number(`${hours.toString().padStart(2, '0')}9${minutes.toString().padStart(2, '0')}`);

            console.log(duration);
            if(!searchFrom){
                return {
                    status: "Failed",
                    message: "from location did'nt found please choose the other location!",
                    data: null,
                };
            }

            if(!searchTo){
                return {
                    status: "Failed",
                    message: "To location did'nt found please choose the other location!",
                    data: null,
                };
            }

            if(from.toLowerCase() === to.toLowerCase()){
                return {
                    status: "Failed",
                    message: "Location must be different!",
                    data: null,
                };
            }

            if(getdataAirportFrom.airport_location !== from){
                return {
                    status: "Failed",
                    message: "Airport ID did'nt match with from location",
                    data: null,
                };
            }

            if(getdataAirportTo.airport_location !== to){
                return {
                    status: "Failed",
                    message: "Airport ID did'nt match with to location",
                    data: null,
                };
            }


            const ticket = await flightRepository.create({
                airline_id: reqBody.airline_id,
                airport_id_from: reqBody.airport_id_from,
                airport_id_to: reqBody.airport_id_to,
                departure_date: reqBody.departure_date,
                departure_time: reqBody.departure_time,
                arrival_date: reqBody.arrival_date,
                arrival_time: reqBody.arrival_time,
                from: reqBody.from,
                to: reqBody.to,
                duration: duration,
                price: reqBody.price,
                flight_class: reqBody.flight_class,
                description: reqBody.description,
            });

            const flight = await flightRepository.findTicketFilter(ticket.id);

            return {
                status: "Success",
                message: "Flight data successfuly create!",
                data: flight,
            };
        } catch (err) {
            throw err;
        }
    },
    
    async search(reqBody, reqQuery) {
        try {
            const from  = reqBody.from;
            const to = reqBody.to;
            const departure_date = reqBody.departure_date;
            const departure_time = reqBody.departure_time;
            const flight_class = reqBody.flight_class;
            const departure = new Date(departure_date);
            const returnDate = reqBody.returnDate;
            const departureReturn = new Date(returnDate)
            const toLower = reqQuery.toLower;
            const earlyDeparture = reqQuery.earlyDeparture;
            const lastDeparture = reqQuery.lastDeparture;
            const earlyArrive = reqQuery.earlyArrive;
            const lastArrive = reqQuery.lastArrive;
            
            const departureAsc = reqQuery.departureAsc
            
            if (
                !reqBody.from ||
                !reqBody.to ||
                !reqBody.departure_date ||
                !reqBody.departure_time ||
                !reqBody.flight_class
            ) {
                return {
                    status: "Failed",
                    message: "form search must be filled!",
                    data: null,
                };
            }

            const searchFrom = await flightRepository.findLocation(reqBody.from);
            const searchTo = await flightRepository.findLocation(reqBody.to);

            if(!searchFrom){
                return {
                    status: "Failed",
                    message: "from location did'nt found please choose the other location!",
                    data: null,
                };
            }

            if(!searchTo){
                return {
                    status: "Failed",
                    message: "To location did'nt found please choose the other location!",
                    data: null,
                };
            }

            if(reqBody.from.toLowerCase() === reqBody.to.toLowerCase()){
                return {
                    status: "Failed",
                    message: "Location must be different!",
                    data: null,
                };
            }

            // const  flightschedule = await flightRepository.findSchedule(from, to, departure, yesterday);
            const flight = await flightRepository.findAll();
            const array = [];
            const filter = flight.map(schedule => array.push({
                id: schedule.id,
                airline_id: schedule.airline_id,
                airline: schedule.Airline.airline_name,
                airlane_code: schedule.Airline.airline_code,
                airport_id_from: schedule.airport_id_from,
                from: schedule.from,
                airport_from_code: schedule.Airport_from.airport_code,
                airport_from: schedule.Airport_from.airport_name,
                airport_id_to: schedule.airport_id_to,
                to: schedule.to,
                airport_to_code: schedule.Airport_to.airport_code,
                airport_to: schedule.Airport_to.airport_name,
                departure_date: schedule.departure_date,
                departure_time: schedule.departure_time,
                arrival_date: schedule.arrival_date,
                arrival_time: schedule.arrival_time,
                duration: schedule.duration,
                price: schedule.price,
                flight_class: schedule.flight_class,
                description: schedule.description,
            }));


            if(!returnDate){
                const search = array.filter((data) => data.from === from && data.to === to && data.departure_date >= departure && data.departure_time >= departure_time && data.flight_class === flight_class) 

                if(
                    (toLower && earlyDeparture && lastDeparture && earlyArrive && lastArrive) ||
                    (toLower && earlyDeparture && lastDeparture && earlyArrive) ||
                    (toLower && earlyDeparture && lastDeparture && lastArrive) ||
                    (toLower && earlyArrive && lastArrive && earlyDeparture)||
                    (toLower && earlyArrive && lastArrive && lastDeparture) ||
                    (toLower && earlyDeparture && lastDeparture) ||
                    (toLower && earlyDeparture && earlyArrive) ||
                    (toLower && earlyDeparture && lastArrive) ||
                    (toLower && lastDeparture && earlyArrive) ||
                    (toLower && lastDeparture && lastArrive) ||
                    (toLower && earlyArrive && lastArrive) ||
                    (earlyArrive && lastArrive && lastDeparture) ||
                    (earlyArrive && lastArrive && earlyDeparture) ||
                    (earlyDeparture && lastDeparture && earlyArrive)||
                    (earlyDeparture && lastDeparture && lastArrive)||
                    (earlyDeparture && earlyArrive)||
                    (earlyDeparture && lastArrive)||
                    (lastDeparture && lastArrive)||
                    (lastDeparture && earlyArrive)
                ){
                    return {
                        status: "Failed",
                        message: "Filter Result Not Found!",
                        data: null,
                    };
                }

                if(toLower && earlyDeparture){
                    const priceEarlydeparture = search.sort((a, b) => a.departure_date - b.departure_date || a.departure_time.localeCompare(b.departure_time) || a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: priceEarlydeparture,
                    };
                }

                if(toLower && lastDeparture){
                    const priceLastdeparture = search.sort((a, b) => a.departure_date - b.departure_date || b.departure_time.localeCompare(a.departure_time) || a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: priceLastdeparture,
                    };
                }

                if(toLower && earlyArrive){
                    const priceEarlyArrive = search.sort((a, b) => a.arrival_date - b.arrival_date || a.arrival_time.localeCompare(b.arrival_time) || a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: priceEarlyArrive,
                    };
                }

                if(toLower && lastArrive){
                    const priceLastArrive = search.sort((a, b) => a.arrival_date - b.arrival_date || b.arrival_time.localeCompare(a.arrival_time) || a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: priceLastArrive,
                    };
                }

                if(toLower){
                    const lowerPrice = search.sort((a, b) => a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lowerPrice,
                    };
                }
                // if (departureAsc === "departure_asc") {
                //     search.sort((a, b) => {
                //         const timeA = new Date(`${a.departure_date}T${a.departure_time}`);
                //         const timeB = new Date(`${b.departure_date}T${b.departure_time}`);
                //         return timeA - timeB;
                //     });
                // }

                if(earlyDeparture){
                    const earlyDepartured = search.sort((a, b) => a.departure_date - b.departure_date || a.departure_time.localeCompare(b.departure_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: earlyDepartured,
                    };
                }

                if(lastDeparture){
                    const lastDepartured = search.sort((a, b) => a.departure_date - b.departure_date || b.departure_time.localeCompare(a.departure_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lastDepartured,
                    };
                }

                if(earlyArrive){
                    const earlyArrived = search.sort((a, b) => a.arrival_date - b.arrival_date || a.arrival_time.localeCompare(b.arrival_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: earlyArrived,
                    };
                }

                if(lastArrive){
                    const lastArrived = search.sort((a, b) => a.arrival_date - b.arrival_date || b.arrival_time.localeCompare(a.arrival_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lastArrived,
                    };
                }
                
                return {
                    status: "Success",
                    message: "Result Search",
                    data: search,
                };
            }

            

            if (returnDate) {
                const searchReturn = array.filter((data) => data.from === to && data.to === from && data.departure_date >= departureReturn && data.departure_time >= departure_time && data.flight_class === flight_class);

                // NGEFILTER QUERY YANG TIDAK BISA DI FILTER
                if(
                    (toLower && earlyDeparture && lastDeparture && earlyArrive && lastArrive) ||
                    (toLower && earlyDeparture && lastDeparture && earlyArrive) ||
                    (toLower && earlyDeparture && lastDeparture && lastArrive) ||
                    (toLower && earlyArrive && lastArrive && earlyDeparture)||
                    (toLower && earlyArrive && lastArrive && lastDeparture) ||
                    (toLower && earlyDeparture && lastDeparture) ||
                    (toLower && earlyDeparture && earlyArrive) ||
                    (toLower && earlyDeparture && lastArrive) ||
                    (toLower && lastDeparture && earlyArrive) ||
                    (toLower && lastDeparture && lastArrive) ||
                    (toLower && earlyArrive && lastArrive) ||
                    (earlyArrive && lastArrive && lastDeparture) ||
                    (earlyArrive && lastArrive && earlyDeparture) ||
                    (earlyDeparture && lastDeparture && earlyArrive)||
                    (earlyDeparture && lastDeparture && lastArrive)||
                    (earlyDeparture && earlyArrive)||
                    (earlyDeparture && lastArrive)||
                    (lastDeparture && lastArrive)||
                    (lastDeparture && earlyArrive)
                ){
                    return {
                        status: "Failed",
                        message: "Filter Result Not Found!",
                        data: null,
                    };
                }

                if(toLower && earlyDeparture){
                    const priceEarlydepartureReturn = searchReturn.sort((a, b) => a.departure_date - b.departure_date || a.departure_time.localeCompare(b.departure_time) || a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: priceEarlydepartureReturn,
                    };
                }

                if(toLower && lastDeparture){
                    const priceLastdepartureReturn = searchReturn.sort((a, b) => a.departure_date - b.departure_date || b.departure_time.localeCompare(a.departure_time) || a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: priceLastdepartureReturn,
                    };
                }

                if(toLower && earlyArrive){
                    const priceEarlyArriveReturn = searchReturn.sort((a, b) => a.arrival_date - b.arrival_date || a.arrival_time.localeCompare(b.arrival_time) || a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: priceEarlyArriveReturn,
                    };
                }

                if(toLower && lastArrive){
                    const priceLastArriveReturn = searchReturn.sort((a, b) => a.arrival_date - b.arrival_date || b.arrival_time.localeCompare(a.arrival_time) || a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: priceLastArriveReturn,
                    };
                }

                if(toLower){
                    const lowerPriceReturn = searchReturn.sort((a, b) => a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lowerPriceReturn,
                    };
                }

                if(earlyDeparture){
                    const earlyDeparturedReturn = searchReturn.sort((a, b) => a.departure_date - b.departure_date || a.departure_time.localeCompare(b.departure_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: earlyDeparturedReturn,
                    };
                }

                if(lastDeparture){
                    const lastDeparturedReturn = searchReturn.sort((a, b) => a.departure_date - b.departure_date || b.departure_time.localeCompare(a.departure_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lastDeparturedReturn,
                    };
                }

                if(earlyArrive){
                    const earlyArrivedReturn = searchReturn.sort((a, b) => a.arrival_date - b.arrival_date || a.arrival_time.localeCompare(b.arrival_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: earlyArrivedReturn,
                    };
                }

                if(lastArrive){
                    const lastArrivedReturn = searchReturn.sort((a, b) => a.arrival_date - b.arrival_date || b.arrival_time.localeCompare(a.arrival_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lastArrivedReturn,
                    };
                }

                return {
                    status: "Success",
                    message: "Result Search",
                    data: searchReturn,
                };
            }
          
        

        } catch (err) {
            throw err;
        }
    },

    async update(id, reqBody) {
        try {

            const from = reqBody.from;
            const to = reqBody.to;
            const airportIdFrom = reqBody.airport_id_from;
            const airportIdTo = reqBody.airport_id_to;
            const data = await flightRepository.findFlight(id);
            const getdataAirportFrom = await flightRepository.findAirport(data.airport_id_from);
            const getdataAirportTo = await flightRepository.findAirport(data.airport_id_to);

            if(to && from && airportIdFrom && airportIdTo){
                const searchTo = await flightRepository.findLocation(to);
                const searchFrom = await flightRepository.findLocation(from);
                const aiportDataReqFrom = await flightRepository.findAirport(airportIdFrom);
                const aiportDataReqTo = await flightRepository.findAirport(airportIdTo);

                if(!searchFrom){
                    return {
                        status: "Failed",
                        message: "from location did'nt found please choose the other location!",
                        data: null,
                    };
                }

                if(!searchTo){
                    return {
                        status: "Failed",
                        message: "To location did'nt found please choose the other location!",
                        data: null,
                    };
                }

                if(from.toLowerCase() === to.toLowerCase()){
                    return {
                        status: "Failed",
                        message: "Location must be different!",
                        data: null,
                    };
                }

                if(searchFrom && searchFrom.airport_location !== aiportDataReqFrom.airport_location){
                    return {
                        status: "Failed",
                        message: "Airport ID did'nt match with from location, You must change airport_id_from too!",
                        data: null,
                    };
                }

                if(searchTo && searchTo.airport_location !== aiportDataReqTo.airport_location){
                    return {
                        status: "Failed",
                        message: "Airport ID did'nt match with to location, You must change airport_id_to too!",
                        data: null,
                    };
                }
            }

            if(to&&from&&!airportIdFrom&&!airportIdTo){
                const searchTo = await flightRepository.findLocation(to);
                const searchFrom = await flightRepository.findLocation(from);

                if(!searchFrom){
                    return {
                        status: "Failed",
                        message: "from location did'nt found please choose the other location!",
                        data: null,
                    };
                }

                if(!searchTo){
                    return {
                        status: "Failed",
                        message: "To location did'nt found please choose the other location!",
                        data: null,
                    };
                }

                if(from.toLowerCase() === to.toLowerCase()){
                    return {
                        status: "Failed",
                        message: "Location must be different!",
                        data: null,
                    };
                }

                if(searchFrom && searchFrom.airport_location !== getdataAirportFrom.airport_location){
                    return {
                        status: "Failed",
                        message: "Airports ID did'nt match with from location, You must change airport_id_from too!",
                        data: null,
                    };
                }

                if(searchTo && searchTo.airport_location !== getdataAirportTo.airport_location){
                    return {
                        status: "Failed",
                        message: "Airport ID did'nt match with to location, You must change airport_id_to too!",
                        data: null,
                    };
                }
            }

            if(from && !airportIdFrom){
                const searchFrom = await flightRepository.findLocation(from);
                if(!searchFrom){
                    return {
                        status: "Failed",
                        message: "from location did'nt found please choose the other location!",
                        data: null,
                    };
                }

                if(searchFrom && searchFrom.airport_location !== getdataAirportFrom.airport_location){
                    return {
                        status: "Failed",
                        message: "Airportss ID did'nt match with from location, You must change airport_id_from too!",
                        data: null,
                    };
                }
            }

            if(to && !airportIdTo){
                const searchTo = await flightRepository.findLocation(to);
                if(!searchTo){
                    return {
                        status: "Failed",
                        message: "To location did'nt found please choose the other location!",
                        data: null,
                    };
                }

                if(searchTo && searchTo.airport_location !== getdataAirportTo.airport_location){
                    return {
                        status: "Failed",
                        message: "Airportss ID did'nt match with to location, You must change airport_id_to too!",
                        data: null,
                    };
                }
            }

            const ticket = await flightRepository
                .update(id, {
                    airline_id: reqBody.airline_id,
                    airport_id_from: reqBody.airport_id_from,
                    airport_id_to: reqBody.airport_id_to,
                    departure_date: reqBody.departure_date,
                    departure_time: reqBody.departure_time,
                    arrival_date: reqBody.arrival_date,
                    arrival_time: reqBody.arrival_time,
                    from: reqBody.from,
                    to: reqBody.to,
                    duration: reqBody.duration,
                    price: reqBody.price,
                    flight_class: reqBody.flight_class,
                    description: reqBody.description,
                })
                .then((result) => {
                    return result;
                });

            return {
                status: "Success",
                message: "Flight data successfuly updated!",
                data: ticket,
            };
        } catch (err) {
            throw err;
        }
    },

    async delete(id) {
        try {
            const findDataDelete = await flightRepository.findFlight(id);
            if(!findDataDelete){
                return {
                    status: "Failed",
                    message: "Flight data Not Found!",
                    data: null,
                }
            }
            const ticket = await flightRepository.delete(id);

            return {
                status: "Success",
                message: "Flight data successfuly deleted!",
                data: ticket,
            };
        } catch (err) {
            throw err;
        }
    },
};
