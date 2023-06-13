const flightRepository = require("../repositories/flightRepository");
const airlineRepository = require("../repositories/airlineRepository");


const dayjs = require("dayjs");
const { DATE } = require("sequelize");

function sortTicketsByPriceAscending(tickets) {
    return tickets.sort((a, b) => a.price - b.price);
}

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
                !reqBody.airport_id ||
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

            const airportId = reqBody.airport_id;
            const getdataAirport = await flightRepository.findAirport(airportId);

            const from = reqBody.from;
            const to = reqBody.to;
            const searchFrom = await flightRepository.findLocation(from);
            const searchTo = await flightRepository.findLocation(to);

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

            if(getdataAirport.airport_location !== from){
                return {
                    status: "Failed",
                    message: "Airport ID did'nt match with from location",
                    data: null,
                };
            }


            const ticket = await flightRepository.create({
                airline_id: reqBody.airline_id,
                airport_id: reqBody.airport_id,
                departure_date: reqBody.departure_date,
                departure_time: reqBody.departure_time,
                arrival_date: reqBody.arrival_date,
                arrival_time: reqBody.arrival_time,
                from: reqBody.from,
                to: reqBody.to,
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
            const departure = new Date(departure_date);
            const returnDate = reqBody.returnDate;
            const departureReturn = new Date(returnDate);
            const lowPrice = reqQuery.lowPrice;
            const departureAsc = reqQuery.departureAsc
            const earlyDeparture = reqQuery.earlyDeparture
            
            if (
                !reqBody.from ||
                !reqBody.to ||
                !reqBody.departure_date ||
                !reqBody.departure_time 
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
                airline_id: schedule.airline_id,
                airport_id: schedule.airport_id,
                departure_date: schedule.departure_date,
                departure_time: schedule.departure_time,
                arrival_date: schedule.arrival_date,
                arrival_time: schedule.arrival_time,
                from: schedule.from,
                to: schedule.to,
                price: schedule.price,
                flight_class: schedule.flight_class,
                description: schedule.description,
                airplane: schedule.Airline.airline_code,
                airplane_code: schedule.Airline.airline_name,
                airport: schedule.Airport.airport_code,
                airport_code: schedule.Airport.airport_name,

            }));


            if(!returnDate){
                const search = array.filter((data) => data.from === from && data.to === to && data.departure_date >= departure && data.departure_time >= departure_time) 

                if (lowPrice === "true") {
                    search.sort((a, b) => a.price - b.price);
                }
                if (departureAsc === "departure_asc") {
                    search.sort((a, b) => {
                        const timeA = new Date(`${a.departure_date}T${a.departure_time}`);
                        const timeB = new Date(`${b.departure_date}T${b.departure_time}`);
                        return timeA - timeB;
                    });
                }

                if(earlyDeparture){
                    const earlyDepartured = search.sort((a, b) => a.departure_date - b.departure_date || a.departure_time.localeCompare(b.departure_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: {
                            berangkat: earlyDepartured,
                            pulang: [],
                        },
                    };
                }

                
                return {
                    status: "Success",
                    message: "Result Search",
                    data: search,
                };
            }

            

            if (returnDate) {
                const search = array.filter((data) => data.from === from && data.to === to && data.departure_date >= departure && data.departure_time >= departure_time);
                const searchReturn = array.filter((data) => data.from === to && data.to === from && data.departure_date >= departureReturn && data.departure_time >= departure_time);

                return {
                    status: "Success",
                    message: "Result Search",
                    data: {
                        berangkat: search,
                        pulang: searchReturn,
                    },
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
            const airportId = reqBody.airport_id;
            const data = await flightRepository.findFlight(id);
            const getdataAirport = await flightRepository.findAirport(data.airport_id);

            if(to && from && airportId ){
                const searchTo = await flightRepository.findLocation(to);
                const searchFrom = await flightRepository.findLocation(from);
                const aiportDataReq = await flightRepository.findAirport(airportId);

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

                if(searchFrom && searchFrom.airport_location !== aiportDataReq.airport_location){
                    return {
                        status: "Failed",
                        message: "Airport ID did'nt match with from location, You must change airport_id too!",
                        data: null,
                    };
                }
            }

            if(to&&from&&!airportId){
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

                if(searchFrom && searchFrom.airport_location !== getdataAirport.airport_location){
                    return {
                        status: "Failed",
                        message: "Airports ID did'nt match with from location, You must change airport_id too!",
                        data: null,
                    };
                }
            }

            if(from && !airportId){
                const searchFrom = await flightRepository.findLocation(from);
                if(!searchFrom){
                    return {
                        status: "Failed",
                        message: "from location did'nt found please choose the other location!",
                        data: null,
                    };
                }

                if(searchFrom && searchFrom.airport_location !== getdataAirport.airport_location){
                    return {
                        status: "Failed",
                        message: "Airportss ID did'nt match with from location, You must change airport_id too!",
                        data: null,
                    };
                }
            }

            if(to){
                const searchTo = await flightRepository.findLocation(to);
                if(!searchTo){
                    return {
                        status: "Failed",
                        message: "To location did'nt found please choose the other location!",
                        data: null,
                    };
                }
            }


            const ticket = await flightRepository
                .update(id, {
                    airline_id: reqBody.airline_id,
                    airport_id: reqBody.airport_id,
                    departure_date: reqBody.departure_date,
                    departure_time: reqBody.departure_time,
                    arrival_date: reqBody.arrival_date,
                    arrival_time: reqBody.arrival_time,
                    from: reqBody.from,
                    to: reqBody.to,
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
            const ticket = await flightRepository.delete(id);
            if(!findDataDelete){
                return {
                    status: "Failed",
                    message: "Flight data Not Found!",
                    data: null,
                }
            }

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
