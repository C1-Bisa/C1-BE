const flightRepository = require("../repositories/flightRepository");
const airlineRepository = require("../repositories/airlineRepository");

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
