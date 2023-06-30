const request = require("supertest");
const app = require ("../../../../../app");

jest.useFakeTimers('legacy')

describe("PUT /api/v1/airport/:id",() => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Update data Airport success response with 200 as status code", async () => {
        const payloadUpdate = {
            airport_code: 'BS',
            airport_name: 'Banyuwangi',
            airport_location: 'Banyuwangi'
        }

        return await request(app).put("/api/v1/airport/7").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(200);
        });
    });

    it("Update data Airport success response with 422 as status code", async () => {
        const payloadUpdate = {
            airport_code: 'BS',

            airport_name: 'Banyuwangi',
            airport_location: 'Banyuwangi'
        }

        return await request(app).put("/api/v1/airport/8000").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    });


    it("Update data Airport FAILED: Unauthorized", async () => {
        const payloadUpdate = {
            airport_code: 'BS',
            airport_name: 'Banyuwangi',
            airport_location: 'Banyuwangi'
        }

        return await request(app).put("/api/v1/airport/8").send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
});