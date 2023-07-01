const flightRepository = require("../repositories/flightRepository");



module.exports = {
    async listFlight(){
        try {
            const flight = await flightRepository.findAll();
            //add get total count notif isread false
            const flightCount = await flightRepository.getTotalFlight();

            return {
                data: flight,
                count: flightCount,
            };
        } catch (err) {
            throw err;
        }
    },

    // async list(reqBody, reqQuery) {
    //     try {
    //         const {from,to,departure_date,departure_time,flight_class,returnDate} = reqBody
    //         const {lowPrice,earlyDeparture,lastDeparture,earlyArrive,lastArrive } = reqQuery;

    //         const departureTomorrow = new Date(departure_date)
    //         departureTomorrow.setDate(departureTomorrow.getDate() + 1);
    //         const departureYesterday = new Date(departure_date)
    //         departureYesterday.setDate(departureYesterday.getDate() - 1);

    //         if(
    //             !from ||
    //             !to ||
    //             !departure_date ||
    //             !departure_time ||
    //             !flight_class
    //         ) {
    //             return {
    //                 status: "Failed",
    //                 message: "form search must be filled!",
    //                 data: null,
    //             };
    //         }

    //         if(reqBody.from.toLowerCase() === reqBody.to.toLowerCase()){
    //             return {
    //                 status: "Failed",
    //                 message: "Location must be different!",
    //                 data: null,
    //             };
    //         }

    //         // Mencari data penerbangan dan mengisinya ke dalam array
    //         const flight = await flightRepository.findAll();
    //         const array = [...flight];

    //         if(!returnDate){
    //             const flightSchedule = array.filter((data) => {
    //             const date = new Date(data.departure_date);
    //                 return (
    //                     data.from === from &&
    //                     data.to === to &&
    //                     date > departureYesterday &&
    //                     date < departureTomorrow &&
    //                     data.flight_class === flight_class
    //                 )
    //             });

    //             if (flightSchedule.length === 0) {
    //                 return {
    //                   status: "Failed",
    //                   message: "Data tidak ditemukan",
    //                   data: null,
    //                 };
    //             }

    //             // Filter early departure
    //             if(earlyDeparture){
    //                 const earlyDepartured = flightSchedule.sort((a, b) =>  a.departure_time.localeCompare(b.departure_time));
    //                 return {
    //                     status: "Success",
    //                     message: "Result Search",
    //                     data: earlyDepartured,
    //                 };
    //             }

    //             // Filter last departure
    //             if(lastDeparture){
    //                 const lastDepartured = flightSchedule.sort((a, b) =>  b.departure_time.localeCompare(a.departure_time));
    //                 return {
    //                     status: "Success",
    //                     message: "Result Search",
    //                     data: lastDepartured,
    //                 };
    //             }

    //             // Filter harga terendah
    //             if(lowPrice){
    //                 const lowerPrice = flightSchedule.sort((a, b) => a.price - b.price);
    //                 return {
    //                     status: "Success",
    //                     message: "Result Search",
    //                     data: lowerPrice,
    //                 };
    //             }

    //             // Filter early arrival
    //             if(earlyArrive){
    //                 const earlyArrived = flightSchedule.sort((a, b) =>  a.arrival_time.localeCompare(b.arrival_time));
    //                 return {
    //                     status: "Success",
    //                     message: "Result Search",
    //                     data: earlyArrived,
    //                 };
    //             }

    //             // Filter las arrival
    //             if(lastArrive){
    //                 const lastArrived = flightSchedule.sort((a, b) =>  b.arrival_time.localeCompare(a.arrival_time));
    //                 return {
    //                     status: "Success",
    //                     message: "Result Search",
    //                     data: lastArrived,
    //                 };
    //             }
                
    //             return {
    //                 status: "Success",
    //                 message: "Result Search",
    //                 data: flightSchedule,
    //             };
    //         }   
    //     } catch (err) {
    //         throw err;
    //     }
    // },

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

            const flight = await flightRepository.findFlightData(ticket.id);

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
            // req body
            const from  = reqBody.from;
            const to = reqBody.to;
            const departure_date = reqBody.departure_date;
            const departure_time = reqBody.departure_time;
            const flight_class = reqBody.flight_class;
            const departure = new Date(departure_date);
            const departureTomorrow = new Date(departure_date)
            departureTomorrow.setDate(departureTomorrow.getDate() + 1);
            const departureYesterday = new Date(departure_date)
            departureYesterday.setDate(departureYesterday.getDate() - 1);
            const returnDate = reqBody.returnDate;
            const departureReturn = new Date(returnDate)


            // query
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

            const flight = await flightRepository.findAll();
            const array = [];
            const filter = flight.map(schedule => array.push({
                id: schedule.id,
                airline: schedule.Airline.airline_name,
                airlane_code: schedule.Airline.airline_code,
                airline_image: schedule.Airline.image,
                from: schedule.from,
                airport_from_code: schedule.Airport_from.airport_code,
                airport_from: schedule.Airport_from.airport_name,
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
                const search = array.filter((data) => {
                    const date = new Date(data.departure_date);
                    return (data.from === from && data.to === to && date > departureYesterday && date < departureTomorrow && data.flight_class === flight_class)
                })

                const firstSearch = search.sort((a, b) => a.price - b.price);

                if(toLower){
                    const lowerPrice = search.sort((a, b) => a.price - b.price);
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lowerPrice,
                    };
                }
                if(earlyDeparture){
                    const earlyDepartured = search.sort((a, b) =>  a.departure_time.localeCompare(b.departure_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: earlyDepartured,
                    };
                }

                if(lastDeparture){
                    const lastDepartured = search.sort((a, b) =>  b.departure_time.localeCompare(a.departure_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lastDepartured,
                    };
                }

                if(earlyArrive){
                    const earlyArrived = search.sort((a, b) =>  a.arrival_time.localeCompare(b.arrival_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: earlyArrived,
                    };
                }

                if(lastArrive){
                    const lastArrived = search.sort((a, b) =>  b.arrival_time.localeCompare(a.arrival_time));
                    return {
                        status: "Success",
                        message: "Result Search",
                        data: lastArrived,
                    };
                }
                
                return {
                    status: "Success",
                    message: "Result Search",
                    data: firstSearch,
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
            const data = await flightRepository.findFlightData(id);
            const getdataAirportFrom = await flightRepository.findAirport(data.Airport_from.id);
            const getdataAirportTo = await flightRepository.findAirport(data.Airport_to.id);

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

    async getDetail(req) {
        try{
            const {flight_id, dewasa, anak} = req.body
            const tax = 0.1;
    
            if(flight_id.length === 2){
                const getDataFlight = await flightRepository.findFlight(flight_id[0])
                const getDataFlightDua = await flightRepository.findFlight(flight_id[1])
                
                if(!getDataFlight){
                    return{
                        status: "FAIL",
                        message: "Upss data tidak ada lhoo",
                        data: null
                    }
                }

                if(!getDataFlightDua){
                    return{
                        status: "FAIL",
                        message: "Upss data tidak ada lhoo",
                        data: null
                    }
                }
                const priceFlight = getDataFlight.price;
                const priceFlightDua = getDataFlightDua.price;
        
                const adults = priceFlight * dewasa;
                const child = priceFlight * anak;
                const baby = priceFlight * 0;
        
                const adultsTwo = priceFlightDua * dewasa;
                const childTwo = priceFlightDua * anak;
                const babyTwo = priceFlightDua * 0;
        
                const totalAdults = adults + adultsTwo;
                const totalChild = child + childTwo;
                const totalBaby = baby + babyTwo;
        
                const totalTax = (totalAdults + totalChild + totalBaby ) * tax;
        
                const totalPrice = totalTax + totalAdults + totalChild + totalBaby
    
                return {
                    status: "Success",
                    data:{
                        berangkat: getDataFlight,
                        pulang: getDataFlightDua,
                        totalAdults: totalAdults,
                        totalChild: totalChild,
                        totalBaby: totalBaby,
                        tax: totalTax,
                        totalPrice: totalPrice
                    }
                };
            }else{
                const getDataFlight = await flightRepository.findFlight(flight_id[0])

                if(!getDataFlight){
                    return{
                        status: "FAIL",
                        message: "Upss data tidak ada  lhoo",
                        data: null
                    }
                }
                const priceFlight = getDataFlight.price;

                const adults = priceFlight * dewasa;
                const child = priceFlight * anak;
                const baby = priceFlight * 0;

                const totalTax = (adults + child + baby ) * tax;
        
                const totalPrice = adults + child + baby + totalTax

                return {
                    status: "Success",
                    data: {
                        berangkat: getDataFlight,
                        pulang: {},
                        totalAdults: adults,
                        totalChild: child,
                        totalBaby: baby,
                        tax: totalTax,
                        totalPrice: totalPrice
                    }
                };
            }
        }catch(error){
            throw error
            
        }
    }
};
