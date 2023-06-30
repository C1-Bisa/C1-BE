const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/user/resetPassword",() => {
    
    it("Reset password user success response with 200 as status code", async () => {
        const payload = {
            email: "risa@gmail.com"
        }
        return await request(app).post("/api/v1/user/resetPassword").send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Reset password user FAILED: Email Not Registered! response with 422 as status code", async () => {
        const payload = {
            email: "bennymoza1000000000@gmail.com"
        }
        return await request(app).post("/api/v1/user/resetPassword").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });

});
