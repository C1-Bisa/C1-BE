const airlineRepository = require("../repositories/airlineRepository");
const bcrypt = require("bcryptjs");

module.exports={
    async create(request) { 
      const {airline_code, airline_name} = request.body

      if (!airline_code || !airline_name){
        return{
          data: null,
          message: "Complete your input!",
          status: "Failed"
        }
      }
      
      newAirline = await airlineRepository.create({airline_code, airline_name});
      if(airline_code || airline_name){
        return{
          data: newAirline,
        }
      }
    },

    async list() {
      try {
        const payload = await airlineRepository.findAll();

        const airlinePayload =
        (await payload.length) < 1
          ? []
          : payload.map((airline) => {
              return {
                id: airline?.dataValues?.id,
                airline_code: airline?.dataValues?.airline_code,
                airline_name: airline?.dataValues?.airline_name,
                createdAt: airline?.dataValues?.createdAt,
                updatedAt: airline?.dataValues?.updatedAt,
              };
            });
  
        return {
          data:airlinePayload,
        };
      } catch (err) {
        throw err;
      }
    },

    async getById(id) {
      try {
        const payload = await airlineRepository.find(id);
       
        const airlinePayload = {
            id: payload?.id,
            airline_code: payload?.airline_code,
            airline_name: payload?.airline_name,
            createdAt: payload?.createdAt,
            updatedAt: payload?.updatedAt,
          }
          return airlinePayload;
        
      } catch (err) {
        throw err;
      }
    },

    async update(id, requestBody) {
      try {
        const updatedAirline = await airlineRepository
          .update(id,{
            airline_id: requestBody.airline_id,
            airline_code: requestBody.airline_code,
            airline_name: requestBody.airline_name
          })
          .then((result) => {
            return result;
          });
        
        return {
            status: "Success",
            message: "Airline data successfuly updated!",
            data: updatedAirline,
        };
           
      } catch (error) {
        throw new Error("Failed to update airline");
      }
    },
    
    async delete (airlineId) {
      try {
        await airlineRepository.update(airlineId);
        return await airlineRepository.delete(airlineId);
        
      } catch (error) {
        return{
          message: ( "failed delete airline!")
        }
      }
    },

    async get(id) {
      return airlineRepository.find(id);
    },

}
