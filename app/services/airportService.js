const airportRepository = require("../repositories/airportRepository");
const bcrypt = require("bcryptjs");

module.exports = {

    async list() {
        try {
          const airport = await airportRepository.findAll();
            return {
              data:airport,
            };
        } catch (err) {
          throw new Error("Failed to get airports");
        }
    },

    async getById(id) {
        try {
          const airport = await airportRepository.find(id);
            return{
              status: "Ok",
              message: "Success",
              data: airport
            }
        } catch (error) {
          throw new Error("Failed to get airport");

        }
    },

    async create(request) { 
        const {airport_code, airport_name, airport_location} = request.body
  
        if (!airport_code || !airport_name || !airport_location){
          return{
            data: null,
            message: "Complete your input!",
            status: "Failed"
          }
        }
        
        newAirport = await airportRepository.create({airport_code, airport_name, airport_location});
          return{
            data: newAirport,
          }
    },

    async update(id, requestBody) {
      try {
        const airportId = await airportRepository.find(id);
        
        if(airportId){
          const airport = await airportRepository.update(id, requestBody);
          return{
            status: "Ok",
            message: "Success",
            data: airport
          }
        }else{
          return{
            status: "FAIL",
            message: "Airline not found!",
            data: null
          }

        }
      } catch (error) {
        throw new Error("Failed to update airport");
      }
    },

    async get(id) {
      return airportRepository.find(id);
    },

    async delete (airportId) {
      try {
        const airport = await airportRepository.delete(airportId);
        if(airport){
          return{
            status: "Ok",
            message: "Success",
            data: airport
          }
        }else{
          return{
            status: "FAIL",
            message: "Airport not found!",
            data: null
          }

        }
        
      } catch {
        throw new Error("Failed to delete airport");

      }
    },

  
}