const request = require("supertest");
const app = require ("../../../../../app");


jest.useFakeTimers('legacy')

describe("GET /api/v1/airport/:id",() => {
    it("Get Airport success response with 200 as status code", async () => {
        return await request(app).get("/api/v1/airport/3").then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Get Airport by ID FAILED response with 422 as status code", async () => {
        
        return await request(app).get("/api/v1/airport/300").then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });

   
});