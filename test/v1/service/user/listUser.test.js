const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("GET /api/v1/user",() => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Get all data user success response with 200 as status code", async () => {

        return await request(app).get("/api/v1/user").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Get all data user FAILED: Don't Have permission", async () => {
        return await request(app).get("/api/v1/user").then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
});
