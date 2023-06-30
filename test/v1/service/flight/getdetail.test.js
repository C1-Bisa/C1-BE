const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/flight/getDetail",() => {
    it("Get schedule flight one way by ID success response with 200 as status code", async () => {
        const payload = {
            flight_id : [1],
            dewasa : 2,
            anak : 0,
            bayi : 1
        }
        return await request(app).post("/api/v1/flight/getDetail").send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Get schedule flight two way by ID success response with 200 as status code", async () => {
        const payload = {
            flight_id : [1, 14],
            dewasa : 2,
            anak : 0,
            bayi : 1
        }
        return await request(app).post("/api/v1/flight/getDetail").send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Get schedule flight one way by ID FAILED response with 422 as status code", async () => {
        const payload = {
            flight_id : [1000],
            dewasa : 2,
            anak : 0,
            bayi : 1
        }
        return await request(app).post("/api/v1/flight/getDetail").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });

    it("Get schedule flight two way by ID FAILED response with 422 as status code", async () => {
        const payload = {
            flight_id : [1000, 15],
            dewasa : 2,
            anak : 0,
            bayi : 1
        }
        return await request(app).post("/api/v1/flight/getDetail").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });

    it("Get schedule flight two way by ID FAILED response with 422 as status code", async () => {
        const payload = {
            flight_id : [1, 1000],
            dewasa : 2,
            anak : 0,
            bayi : 1
        }
        return await request(app).post("/api/v1/flight/getDetail").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    });
});