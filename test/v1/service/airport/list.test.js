const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe('API GET /api/v1/airport', () => {
    it('should return a list of airline', async () => {
  
      return await request(app).get("/api/v1/airport").then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
      });
    });

});