const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/user/logout",() => {
    
    it("Logout user success response with 200 as status code", async () => {

        return await request(app).post("/api/v1/user/logout").then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

});
