const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/airline", () => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });
    


    it("Create data Airline success response with 201 as status code", async ()=> {
        const payload = {
                airline_code: 'GA',
                airline_name: 'Garuda Indonesia'
        }
        return await request(app).post("/api/v1/airline").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(201);
        });
    })

    it("Create data Airline FAILED: form must be filled response with 422 as status code", async ()=> {
        const payload = {
            airline_code: 'GA',
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Create data Airline FAILED: Don't Have permission", async () => {
        const payload = {
            airline_code: 'GA',
            airline_name: 'Garuda Indonesia'
        }
        return await request(app).post("/api/v1/airline").send(payload).then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
})