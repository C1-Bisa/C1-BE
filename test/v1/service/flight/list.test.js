const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("GET /api/v1/flight/getflight",() => {
    test("Get schedule flight success response with 200 as status code", async () => {

        return await request(app).get("/api/v1/flight/getflight").then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });
});