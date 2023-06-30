const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/flight/createflight", () => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Create data flight success response with 201 as status code", async ()=> {
        const payload = {
                airline_id: 4,
                airport_id_from: 1,
                airport_id_to: 6,
                departure_date: "2023-06-20",
                departure_time: "19:50",
                arrival_date: "2023-06-20",
                arrival_time: "22:35",
                from: "Jakarta",
                to: "Bali",
                price: 2200000,
                flight_class: "Bussiness",
                description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(201);
        });
    })

    it("Create data flight FAILED: form must be filled response with 422 as status code", async ()=> {
        const payload = {
                airline_id: 4,
                airport_id_from: 1,
                airport_id_to: 6,
                departure_date: "2023-06-20",
                departure_time: "19:50",
                arrival_date: "2023-06-20",
                arrival_time: "22:35",
                to: "Bali",
                price: 2200000,
                flight_class: "Bussiness",
                description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Create data flight FAILED:  To location did'nt found please choose the other location! response with 422 as status code", async ()=> {
        const payload = {
            airline_id: 4,
            airport_id_from: 1,
            airport_id_to: 6,
            departure_date: "2023-06-20",
            departure_time: "19:50",
            arrival_date: "2023-06-20",
            arrival_time: "22:35",
            from: "Jakarta",
            to: "Sukodono",
            price: 2200000,
            flight_class: "Bussiness",
            description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Create data flight FAILED:  from location did'nt found please choose the other location! response with 422 as status code", async ()=> {
        const payload = {
            airline_id: 4,
            airport_id_from: 1,
            airport_id_to: 6,
            departure_date: "2023-06-20",
            departure_time: "19:50",
            arrival_date: "2023-06-20",
            arrival_time: "22:35",
            from: "Sukodono",
            to: "Bali",
            price: 2200000,
            flight_class: "Bussiness",
            description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Create data flight FAILED:  Location must be different! response with 422 as status code", async ()=> {
        const payload = {
            airline_id: 4,
            airport_id_from: 1,
            airport_id_to: 6,
            departure_date: "2023-06-20",
            departure_time: "19:50",
            arrival_date: "2023-06-20",
            arrival_time: "22:35",
            from: "Bali",
            to: "Bali",
            price: 2200000,
            flight_class: "Bussiness",
            description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Create data flight FAILED: Airport ID did'nt match with from location response with 422 as status code", async ()=> {
        const payload = {
                airline_id: 4,
                airport_id_from: 5,
                airport_id_to: 6,
                departure_date: "2023-06-20",
                departure_time: "19:50",
                arrival_date: "2023-06-20",
                arrival_time: "22:35",
                from: "Jakarta",
                to: "Bali",
                price: 2200000,
                flight_class: "Bussiness",
                description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Create data flight FAILED: Airport ID did'nt match with to location response with 422 as status code", async ()=> {
        const payload = {
                airline_id: 4,
                airport_id_from: 1,
                airport_id_to: 5,
                departure_date: "2023-06-20",
                departure_time: "19:50",
                arrival_date: "2023-06-20",
                arrival_time: "22:35",
                from: "Jakarta",
                to: "Bali",
                price: 2200000,
                flight_class: "Bussiness",
                description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).post("/api/v1/flight/createflight").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Create data flight FAILED: Don't Have permission", async () => {
        const payload = {
            airline_id: 4,
            airport_id_from: 1,
            airport_id_to: 6,
            departure_date: "2023-06-20",
            departure_time: "19:50",
            arrival_date: "2023-06-20",
            arrival_time: "22:35",
            from: "Jakarta",
            to: "Bali",
            price: 2200000,
            flight_class: "Bussiness",
            description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).post("/api/v1/flight/createflight").send(payload).then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
})