const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("Get /api/v1/user/resendcode/:id", () => {
    it("Resend otp code new user response with 201 as status code", async () => {

        return await request(app).get("/api/v1/user/resendcode/2").then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Resend otp code new user FAILED: User Not found response with 422 as status code", async () => {

        return await request(app).get("/api/v1/user/resendcode/100").then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 
})