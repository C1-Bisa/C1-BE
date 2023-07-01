const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/transaction/getById",() => {
    let jwtTokenUser = ''
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
                    seatDeparture: "B3",
                    seatReturn: "H3"
                }
            ]
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenUser = response.body.data.token;
        const responses = await request(app).post('/api/v1/transaction').set("Authorization", `Bearer ${jwtTokenUser}`).send(payload);
        t_code = responses.body.data.transaction.id;
    });

    it("Get History Booking data user BY ID success response with 201 as status code", async () => {
        const payload = {
            transaction_id: t_code
        }
        return await request(app).post("/api/v1/transaction/getById").set("Authorization", `Bearer ${jwtTokenUser}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.body).toBeDefined();
        });
    });


    it("Get History Booking data user BY ID FAILED: response with 422 as status code", async () => {
        const payload = {
            transaction_id: 1000
        }
        return await request(app).post("/api/v1/transaction/getById").set("Authorization", `Bearer ${jwtTokenUser}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });
});
