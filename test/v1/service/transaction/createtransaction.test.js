const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/transaction",() => {
    let jwtTokenUser = ''
    beforeAll(async () => {
        const user = {
            email: "risa@gmail.com",
            password: "risa123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenUser = response.body.data.token;
      });

    it("Create Transaction one way success response with 201 as status code", async () => {
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
                        seatReturn: "H3"
                    }
                ]
        }
        return await request(app).post("/api/v1/transaction").set("Authorization", `Bearer ${jwtTokenUser}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.body).toBeDefined();
        });
    });

    it("Create Transaction Two way success response with 201 as status code", async () => {
        const payload = {
                flights: [{
                    flight_id: 1,
                    flight_type: "Departure"
                },{
                    flight_id: 4,
                    flight_type: "Arrival"
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
                        seatReturn: "H3"
                    }
                ]
        }
        return await request(app).post("/api/v1/transaction").set("Authorization", `Bearer ${jwtTokenUser}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.body).toBeDefined();
        });
    });

    it("Create Transaction Two way success response with 422 as status code", async () => {
        const payload = {
                flights: [{
                    flight_id: 1,
                    flight_type: "Departure"
                },{
                    flight_id: 4,
                    flight_type: "Arrival"
                }
                ],
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
                        seatReturn: "H3"
                    }
                ]
        }
        return await request(app).post("/api/v1/transaction").set("Authorization", `Bearer ${jwtTokenUser}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });
});