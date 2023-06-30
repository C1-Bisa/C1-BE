const airportRepository = require("../../../app/repositories/airportRepository");
const airportService = require("../../../app/services/airportService");

jest.mock("../../../app/repositories/airportRepository");

describe("Airport Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should return airport list", async () => {
      const expectedData = [
        {
          id: 1,
          airport_code: "ABC",
          airport_name: "Airport ABC",
          airport_location: "Location ABC",
          createdAt: "2022-01-01",
          updatedAt: "2022-01-01"
        },
        {
          id: 2,
          airport_code: "DEF",
          airport_name: "Airport DEF",
          airport_location: "Location DEF",
          createdAt: "2022-01-02",
          updatedAt: "2022-01-02"
        }
      ];

      airportRepository.findAll.mockResolvedValue(expectedData);

      const result = await airportService.list();

      expect(result).toEqual({
        data: expectedData
      });
      expect(airportRepository.findAll).toHaveBeenCalled();
    });

    it("should return empty airport list", async () => {
      const expectedData = [];

      airportRepository.findAll.mockResolvedValue(expectedData);

      const result = await airportService.list();

      expect(result).toEqual({
        data: expectedData
      });
      expect(airportRepository.findAll).toHaveBeenCalled();
    });

    it("should throw an error when listing airports", async () => {
      const error = new Error("Failed to get airports");

      airportRepository.findAll.mockRejectedValue(error);

      await expect(airportService.list()).rejects.toThrow(error);
      expect(airportRepository.findAll).toHaveBeenCalled();
    });
    
  });

  describe("getById", () => {
    it("should return airport by ID", async () => {
      const airportId = 1;
      const expectedData = {
        id: 1,
        airport_code: "ABC",
        airport_name: "Airport ABC",
        airport_location: "Location ABC",
        createdAt: "2022-01-01",
        updatedAt: "2022-01-01"
      };

      airportRepository.find.mockResolvedValue(expectedData);

      const result = await airportService.getById(airportId);

      expect(result).toEqual({
        status: "Ok",
        message: "Success",
        data: expectedData
      });
      expect(airportRepository.find).toHaveBeenCalledWith(airportId);
    });

    it("should throw an error when getting airport by ID", async () => {
      const airportId = 1;
      const error = new Error("Failed to get airport");

      airportRepository.find.mockRejectedValue(error);

      await expect(airportService.getById(airportId)).rejects.toThrow(error);
      expect(airportRepository.find).toHaveBeenCalledWith(airportId);
    });
  });

  describe("create", () => {
    it("should return failure status if input is incomplete", async () => {
      const request = {
        body: {
          airport_code: "ABC",
          airport_name: null,
          airport_location: "Location ABC"
        }
      };
  
      const result = await airportService.create(request);
  
      expect(result).toEqual({
        data: null,
        message: "Complete your input!",
        status: "Failed"
      });
      expect(airportRepository.create).not.toHaveBeenCalled();
    });
  
    it("should create a new airport if all fields are provided", async () => {
      const request = {
        body: {
          airport_code: "ABC",
          airport_name: "Airport ABC",
          airport_location: "Location ABC"
        }
      };
  
      const newAirport = {
        id: 1,
        airport_code: "ABC",
        airport_name: "Airport ABC",
        airport_location: "Location ABC",
        createdAt: "2022-01-01",
        updatedAt: "2022-01-01"
      };
  
      airportRepository.create.mockResolvedValue(newAirport);
  
      const result = await airportService.create(request);
  
      expect(result).toEqual({
        data: newAirport
      });
      expect(airportRepository.create).toHaveBeenCalledWith({
        airport_code: "ABC",
        airport_name: "Airport ABC",
        airport_location: "Location ABC"
      });
    });
  });

  describe("update", () => {
    it("should update the airport and return success status", async () => {
      const airportId = 1;
      const requestBody = {
        airport_code: "ABC",
        airport_name: "Airport ABC",
        airport_location: "Location ABC"
      };
      const expectedData = {
        id: 1,
        airport_code: "ABC",
        airport_name: "Airport ABC",
        airport_location: "Location ABC",
        createdAt: "2022-01-01",
        updatedAt: "2022-01-01"
      };

      airportRepository.find.mockResolvedValue(airportId);
      airportRepository.update.mockResolvedValue(expectedData);

      const result = await airportService.update(airportId, requestBody);

      expect(result).toEqual({
        status: "Ok",
        message: "Success",
        data: expectedData
      });
      expect(airportRepository.find).toHaveBeenCalledWith(airportId);
      expect(airportRepository.update).toHaveBeenCalledWith(airportId, requestBody);
    });

    it("should return failure status if airport is not found", async () => {
      const airportId = 1;
      const requestBody = {
        airport_code: "ABC",
        airport_name: "Airport ABC",
        airport_location: "Location ABC"
      };

      airportRepository.find.mockResolvedValue(null);

      const result = await airportService.update(airportId, requestBody);

      expect(result).toEqual({
        status: "FAIL",
        message: "Airline not found!",
        data: null
      });
      expect(airportRepository.find).toHaveBeenCalledWith(airportId);
      expect(airportRepository.update).not.toHaveBeenCalled();
    });

    it("should throw an error if failed to update the airport", async () => {
      const airportId = 1;
      const requestBody = {
        airport_code: "ABC",
        airport_name: "Airport ABC",
        airport_location: "Location ABC"
      };
      const error = new Error("Failed to update airport");

      airportRepository.find.mockResolvedValue(airportId);
      airportRepository.update.mockRejectedValue(error);

      await expect(airportService.update(airportId, requestBody)).rejects.toThrow(error);
      expect(airportRepository.find).toHaveBeenCalledWith(airportId);
      expect(airportRepository.update).toHaveBeenCalledWith(airportId, requestBody);
    });
  });

  describe("delete", () => {
    it("should delete the airport and return success status", async () => {
      const airportId = 1;
      const expectedData = {
        id: 1,
        airport_code: "ABC",
        airport_name: "Airport ABC",
        airport_location: "Location ABC",
        createdAt: "2022-01-01",
        updatedAt: "2022-01-01"
      };

      airportRepository.delete.mockResolvedValue(expectedData);

      const result = await airportService.delete(airportId);

      expect(result).toEqual({
        status: "Ok",
        message: "Success",
        data: expectedData
      });
      expect(airportRepository.delete).toHaveBeenCalledWith(airportId);
    });

    it("should return failure status if airport is not found", async () => {
      const airportId = 1;

      airportRepository.delete.mockResolvedValue(null);

      const result = await airportService.delete(airportId);

      expect(result).toEqual({
        status: "FAIL",
        message: "Airport not found!",
        data: null
      });
      expect(airportRepository.delete).toHaveBeenCalledWith(airportId);
    });

    it("should throw an error if failed to delete the airport", async () => {
      const airportId = 1;
      const error = new Error("Failed to delete airport");

      airportRepository.delete.mockRejectedValue(error);

      await expect(airportService.delete(airportId)).rejects.toThrow(error);
      expect(airportRepository.delete).toHaveBeenCalledWith(airportId);
    });
  });

  describe("get", () => {
    it("should return the airport by ID", async () => {
      const expectedData = {
        airport_id: "1"
      };

      airportRepository.find.mockResolvedValue(expectedData);

      const result = await airportService.get("1");

      expect(result).toEqual(expectedData);
      expect(airportRepository.find).toHaveBeenCalledWith("1");
    });
  });
});
