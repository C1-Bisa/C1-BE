const airlineRepository = require("../../../app/repositories/airlineRepository");
const bcrypt = require("bcryptjs");

const airlineService = require('../../../app/services/airlineSercive');

// Mocking dependencies
jest.mock("../../../app/repositories/airlineRepository");
jest.mock("bcryptjs");

describe("Airline Service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should return failed status if airline_code or airline_name is missing", async () => {
      const request = { body: {} };

      const result = await airlineService.create(request);

      expect(result).toEqual({
        data: null,
        message: "Complete your input!",
        status: "Failed"
      });
    });

    it("should create a new airline and return the data", async () => {
      const request = {
        body: {
          airline_code: "ABC",
          airline_name: "Airline ABC"
        }
      };

      const expectedData = {
        airline_id: "123",
        airline_code: "ABC",
        airline_name: "Airline ABC"
      };

      airlineRepository.create.mockResolvedValue(expectedData);

      const result = await airlineService.create(request);

      expect(result).toEqual({
        data: expectedData
      });
      expect(airlineRepository.create).toHaveBeenCalledWith({
        airline_code: "ABC",
        airline_name: "Airline ABC"
      });
    });
  });

  describe("list", () => {
    it("should return the list of airlines", async () => {
      const expectedData = [
        { airline_id: "1", airline_code: "ABC", airline_name: "Airline ABC" },
        { airline_id: "2", airline_code: "DEF", airline_name: "Airline DEF" }
      ];

      airlineRepository.findAll.mockResolvedValue(expectedData);

      const result = await airlineService.list();

      expect(result).toEqual({
        data: expectedData
      });
      expect(airlineRepository.findAll).toHaveBeenCalled();
    });

    it("should throw an error if failed to delete the airline", async () => {
        const error = new Error("Failed to get airlines");
    
        airlineRepository.findAll.mockRejectedValue(error);
    
        await expect(airlineService.list()).rejects.toThrow(error);
    });
  });

  describe("getById", () => {
    it("should return the airline by ID", async () => {
      const expectedData = {
        airline_id: "1",
        airline_code: "ABC",
        airline_name: "Airline ABC"
      };

      airlineRepository.find.mockResolvedValue(expectedData);

      const result = await airlineService.getById("1");

      expect(result).toEqual({
        status: "Ok",
        message: "Success",
        data: expectedData
      });
      expect(airlineRepository.find).toHaveBeenCalledWith("1");
    });

    it("should throw an error if failed to delete the airline", async () => {
        const airlineId = "1";

        const error = new Error("Failed to get airline");
    
        airlineRepository.find.mockRejectedValue(error);
    
        await expect(airlineService.getById(airlineId)).rejects.toThrow(error);
    });
  });

  describe("update", () => {
    it("should update the airline and return the updated data", async () => {
      const requestBody = {
        airline_code: "ABC",
        airline_name: "Airline ABC"
      };

      const expectedData = {
        airline_code: "ABC",
        airline_name: "Airline ABC"
      };

      airlineRepository.update.mockResolvedValue(expectedData);

      const result = await airlineService.update("1", requestBody);

    });

    it("should throw an error if failed to update the airline", async () => {
      const requestBody = {
        airline_code: "ABC",
        airline_name: "Airline ABC"
      };

      const error = new Error("Failed to update airline");
      airlineRepository.find.mockResolvedValue(true);
      airlineRepository.update.mockRejectedValue(error);


      airlineRepository.update.mockRejectedValue(error);

      await expect(airlineService.update("1", requestBody)).rejects.toThrow(error);
    });
  });

  describe("delete", () => {
    it("should delete the airline and return success status", async () => {
      const airlineId = "1";
      const expectedData = {
        airline_id: "1",
        airline_code: "ABC",
        airline_name: "Airline ABC"
      };

      airlineRepository.delete.mockResolvedValue(expectedData);

      const result = await airlineService.delete(airlineId);

      expect(result).toEqual({
        status: "Ok",
        message: "Success",
        data: expectedData
      });
      expect(airlineRepository.delete).toHaveBeenCalledWith(airlineId);
    });

    it("should return failure status if airline is not found", async () => {
      const airlineId = "1";

      airlineRepository.delete.mockResolvedValue(null);

      const result = await airlineService.delete(airlineId);

      expect(result).toEqual({
        status: "FAIL",
        message: "Airline not found!",
        data: null
      });
      expect(airlineRepository.delete).toHaveBeenCalledWith(airlineId);
    });


    it("should throw an error if failed to delete the airline", async () => {
        const airlineId = "1";
        const error = new Error("Failed to delete airline");
    
        airlineRepository.delete.mockRejectedValue(error);
    
        await expect(airlineService.delete(airlineId)).rejects.toThrow(error);
      });
  });

  describe("get", () => {
    it("should return the airline by ID", async () => {
      const expectedData = {
        airline_id: "1",
        airline_code: "ABC",
        airline_name: "Airline ABC"
      };

      airlineRepository.find.mockResolvedValue(expectedData);

      const result = await airlineService.get("1");

      expect(result).toEqual(expectedData);
      expect(airlineRepository.find).toHaveBeenCalledWith("1");
    });
  });
});
