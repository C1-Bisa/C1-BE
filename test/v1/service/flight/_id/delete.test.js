const request = require("supertest");
const app = require ("../../../../../app");

jest.useFakeTimers('legacy')

describe("DELETE /api/v1/flight/deleteflight/:id",() => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Delete data Flight success response with 200 as status code", async () => {

        return await request(app).delete("/api/v1/flight/deleteflight/10").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
            expect(res.statusCode).toBe(200);
        });
    });

    it("Delete data Flight FAILED: FLight data not found", async () => {
        return await request(app).delete("/api/v1/flight/deleteflight/100000").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Delete data Flight FAILED: Unauthorized", async () => {
        return await request(app).delete("/api/v1/flight/deleteflight/2").then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
});