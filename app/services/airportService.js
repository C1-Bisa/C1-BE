const airportRepository = require("../repositories/airportRepository");
const bcrypt = require("bcryptjs");

module.exports = {

    async list() {
        try {
          const payload = await airportRepository.findAll();
  
          const airportPayload =
          (await payload.length) < 1
            ? []
            : payload.map((airport) => {
                return {
                  id: airport?.dataValues?.id,
                  airport_code: airport?.dataValues?.airport_code,
                  airport_name: airport?.dataValues?.airport_name,
                  airport_location: airport?.dataValues?.airport_location,
                  createdAt: airport?.dataValues?.createdAt,
                  updatedAt: airport?.dataValues?.updatedAt,
                };
              });
    
          return {
            data:airportPayload,
          };
        } catch (err) {
          throw err;
        }
    },

    async getById(id) {
        try {
          const payload = await airportRepository.find(id);
         
          const airportPayload = {
              id: payload?.id,
              airport_code: payload?.airport_code,
              airport_name: payload?.airport_name,
              airport_location: payload?.airport_location,
              createdAt: payload?.createdAt,
              updatedAt: payload?.updatedAt,
            }
            return airportPayload;
          
        } catch (err) {
          throw err;
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
        if(airport_code || airport_name || airport_location){
          return{
            data: newAirport,
          }
        }
    },

    async update(id, requestBody) {
      try {
        const updatedAirport = await airportRepository.update(id, requestBody);
        return { message: 'Airport updated successfully', data: updatedAirport };
      } catch (error) {
        throw new Error("Failed to update user");
      }
    },

    async get(id) {
      return airportRepository.find(id);
    },

    async delete (airportId) {
      try {
        await airportRepository.update(airportId);
        return await airportRepository.delete(airportId);
        
      } catch (error) {
        return{
          message: ( "failed delete airport!")
        }
      }
    },

  
}