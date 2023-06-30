const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/flight/searchflight",() => {
    it("Search schedule flight success response with 200 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Bali",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight with query lower price order success response with 200 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Bali",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").query({toLower:true}).send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight with query early departure order success response with 200 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Bali",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").query({earlyDeparture:true}).send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });
    it("Search schedule flight with query early departure order success response with 200 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Bali",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").query({earlyDeparture:true}).send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight with query last departure order success response with 200 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Bali",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").query({lastDeparture:true}).send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight with query early arrive order success response with 200 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Bali",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").query({earlyArrive:true}).send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight with query last arrive order success response with 200 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Bali",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").query({lastArrive:true}).send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight FAILED: form search must be filled! response with 422 as status code", async () => {
        const payload = {
            from: "Jakarta",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight FAILED: from location did'nt found please choose the other location! response with 422 as status code", async () => {
        const payload = {
            from: "Sukodono",
            to: "Bali",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight FAILED: to location did'nt found please choose the other location! response with 422 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Sukodono",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });

    it("Search schedule flight FAILED: Location must be different! response with 422 as status code", async () => {
        const payload = {
            from: "Jakarta",
            to: "Jakarta",
            departure_date: "2023-06-20",
            departure_time: "07:00",
            flight_class: "Bussiness" 
        }

        return await request(app).post("/api/v1/flight/searchflight").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });
});