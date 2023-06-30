const request = require("supertest");
const app = require ("../../../../../app");

jest.useFakeTimers('legacy')

describe("PUT /api/v1/flight/updateflight/:id",() => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Update data Flight success response with 201 as status code", async () => {
        const payloadUpdate = {
            airline_id: 4,
            airport_id_from: 6,
            airport_id_to: 1,
            departure_date: "2023-06-20",
            departure_time: "19:50",
            arrival_date: "2023-06-20",
            arrival_time: "22:35",
            from: "Bali",
            to: "Jakarta",
            price: 2200000,
            flight_class: "Bussiness",
            description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }

        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(201);
        });
    });

    it("Update data flight FAILED:  from location did'nt found please choose the other location! response with 422 as status code", async ()=> {
        const payloadUpdate = {
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
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  to location did'nt found please choose the other location! response with 422 as status code", async ()=> {
        const payloadUpdate = {
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
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  Location must be different! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            airline_id: 4,
            airport_id_from: 1,
            airport_id_to: 6,
            departure_date: "2023-06-20",
            departure_time: "19:50",
            arrival_date: "2023-06-20",
            arrival_time: "22:35",
            from: "Jakarta",
            to: "Jakarta",
            price: 2200000,
            flight_class: "Bussiness",
            description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  Airport ID did'nt match with from location, You must change airport_id_from too! response with 422 as status code", async ()=> {
        const payloadUpdate = {
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
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  Airport ID did'nt match with to location, You must change airport_id_to too! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            airline_id: 4,
            airport_id_from: 1,
            airport_id_to: 4,
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
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  from location did'nt found please choose the other location! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            from: "Sukodono",
            to: "Bali",
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  to location did'nt found please choose the other location! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            from: "Jakarta",
            to: "Sukodono",
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  Location must be different! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            from: "Jakarta",
            to: "Jakarta",
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  Airports ID did'nt match with from location, You must change airport_id_from too! response with 400 as status code", async ()=> {
        const payloadUpdate = {
            from: "Semarang",
            to: "Bali"
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  Airport ID did'nt match with to location, You must change airport_id_to too! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            from: "Jakarta",
            to: "Semarang",
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  Airports ID did'nt match with from location, You must change airport_id_from too! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            from: "Semarang"
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  From location did'nt found please choose the other location! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            from: "Sukodono"
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  Airports ID did'nt match with to location, You must change airport_id_to too! response with 400 as status code", async ()=> {
        const payloadUpdate = {
            to: "Semarang"
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data flight FAILED:  TO location did'nt found please choose the other location! response with 422 as status code", async ()=> {
        const payloadUpdate = {
            to: "Sukodono"
        }
        return await request(app).put("/api/v1/flight/updateflight/1").set("Authorization", `Bearer ${jwtTokenAdmin}`).send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it("Update data Flight FAILED: Unauthorized", async () => {
        const payloadUpdate = {
            airline_id: 4,
            airport_id_from: 6,
            airport_id_to: 1,
            departure_date: "2023-06-20",
            departure_time: "19:50",
            arrival_date: "2023-06-20",
            arrival_time: "22:35",
            from: "Bali",
            to: "Jakarta",
            price: 2200000,
            flight_class: "Bussiness",
            description: "Perjalanan Menuju Madiun akan ditempuh selama 2 jam perjalanan dengan class Economy"
        }

        return await request(app).put("/api/v1/flight/updateflight/1").send(payloadUpdate).then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
});