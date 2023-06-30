const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/airport", () => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Create data Airport success response with 201 as status code", async ()=> {
        const payload = {
                airport_code: 'BS',
                airport_name: 'Banyuwangi',
                airport_location: 'Banyuwangi'

        }
        return await request(app).post("/api/v1/airport").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(201);
        });
    })

    it("Create data Airport FAILED: form must be filled response with 422 as status code", async ()=> {
        const payload = {
            airport_code: 'BS',
            airport_name: 'Banyuwangi',
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Create data Airport FAILED: Don't Have permission", async () => {
        const payload = {
            airport_code: 'BS',
            airport_name: 'Banyuwangi',
            airport_location: 'Banyuwangi'
        }
        return await request(app).post("/api/v1/airport").send(payload).then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
})