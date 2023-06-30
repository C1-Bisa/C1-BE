const request = require("supertest");
const app = require ("../../../../../app");

jest.useFakeTimers('legacy')

describe("DELETE /api/v1/airport/:id",() => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Delete data Airline success response with 200 as status code", async () => {

        return await request(app).delete("/api/v1/airport/8").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
            expect(res.statusCode).toBe(200);
        });
    });

    it("Delete data Airline FAILED: FLight data not found", async () => {
        return await request(app).delete("/api/v1/airport/100000").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Delete data Airline FAILED: Unauthorized", async () => {
        return await request(app).delete("/api/v1/airport/2").then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
});