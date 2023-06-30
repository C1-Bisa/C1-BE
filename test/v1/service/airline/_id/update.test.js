const request = require("supertest");
const app = require ("../../../../../app");

jest.useFakeTimers('legacy')

describe("PUT /api/v1/airline/:id",() => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Update data Airline success response with 201 as status code", async () => {
        const payloadUpdate = {
            airline_code: 'GA',
            airline_name: 'Garuda Indonesia'
        }

        return await request(app).put("/api/v1/airline/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(200);
        });
    });

    it("Update airline  by ID FAILED response with 422 as status code", async () => {
        
        const payloadUpdate = {
            airline_code: 'GA',
            airline_name: 123456
        }
        return await request(app).put("/api/v1/airline/3000").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    });


    it("Update data Airline FAILED: Unauthorized", async () => {
        const payloadUpdate = {
            airline_code: 'GA',
            airline_name: 'Garuda Indonesia'
        }

        return await request(app).put("/api/v1/airline/16").send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
});