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
        return{
          data: newAirline,
        }
    },

    async list() {
      try {
        const airline = await airlineRepository.findAll();
        return {
          data:airline,
        };
      } catch (err) {
        throw new Error("Failed to get airlines");
      }
    },

    async getById(id) {
      try {
        const airline = await airlineRepository.find(id);
       
        return{
          status: "Ok",
          message: "Success",
          data: airline
        }
        
      } catch (err) {
        throw new Error("Failed to get airline");
      }
    },

    // async update(id, requestBody) {
    //   try {
    //     const updatedAirline = await airlineRepository
    //       .update(id,{
    //         airline_id: requestBody.airline_id,
    //         airline_code: requestBody.airline_code,
    //         airline_name: requestBody.airline_name
    //       })
    //       .then((result) => {
    //         return result;
    //       });
        
    //     return {
    //         status: "Success",
    //         message: "Airline data successfuly updated!",
    //         data: updatedAirline,
    //     };
           
    //   } catch (error) {
    //     throw new Error("Failed to update airline");
    //   }
    // },

    async update(id, requestBody) {
      try {
        const airlineId = await airlineRepository.find(id);
        
        if(airlineId){
          const airline = await airlineRepository.update(id, requestBody);
          return{
            status: "Ok",
            message: "Success",
            data: airline
          }
        }else{
          return{
            status: "FAIL",
            message: "Airline not found!",
            data: null
          }

        }
      } catch (error) {
        throw new Error("Failed to update airline");
      }
    },
    
    async delete (airlineId) {
      try {
        const airline = await airlineRepository.delete(airlineId);
        if(airline){
          return{
            status: "Ok",
            message: "Success",
            data: airline
          }
        }else{
          return{
            status: "FAIL",
            message: "Airline not found!",
            data: null
          }

        }
        
      } catch (error) {
        throw new Error("Failed to delete airline");
      }
    },

    async get(id) {
      return airlineRepository.find(id);
    },

}
