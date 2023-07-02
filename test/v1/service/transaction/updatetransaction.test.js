const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("PUT /api/v1/transaction/update",() => {
    let jwtTokenUser = ''
    let t_code = ''
    beforeAll(async () => {
        const user = {
            email: "risa@gmail.com",
            password: "risa123"
        }
        const payload = {
            flights: [{
                flight_id: 1,
                flight_type: "Departure"
            }
            ],
            amount: 1500000,
            passenger: [
                {
                    type: "Adult",
                    title: "Dewasa",
                    name: "Messi",
                    family_name: "Lionel",
                    birthday: "2001-09-15",
                    nationality: "IDN",
                    nik: 2421412,
                    seatDeparture: "A3",
                    seatReturn: "J3"
                },
                {
                    type: "Child",
                    title: "Dewasa",
                    name: "Messi",
                    family_name: "Lionel",
                    birthday: "2001-09-15",
                    nationality: "IDN",
                    nik: 2421412,
                    seatDeparture: "K3",
                    seatReturn: "U3"
                }
            ]
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenUser = response.body.data.token;
        const responses = await request(app).post('/api/v1/transaction').set("Authorization", `Bearer ${jwtTokenUser}`).send(payload);
        t_code = responses.body.data.transaction.transaction_code;
      });

    it("Update History Booking data user to paid success response with 201 as status code", async () => {
        const payload = {
            transaction_code: t_code
        }
        return await request(app).put("/api/v1/transaction/update").set("Authorization", `Bearer ${jwtTokenUser}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.body).toBeDefined();
        });
    });

    it("Update History Booking data user to paid FAILED: response with 422 as status code", async () => {

        return await request(app).put("/api/v1/transaction/update").set("Authorization", `Bearer ${jwtTokenUser}`).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });
});
