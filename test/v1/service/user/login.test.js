const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/user/login",() => {
    
    it("Login user success response with 201 as status code", async () => {
        const user = {
            email: "risa@gmail.com",
            password: "risa123"
        }

        return await request(app).post("/api/v1/user/login").send(user).then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.body).toBeDefined();
        });
    });

    it("Login user FAILED: response with 401 as status code", async () => {
        const user = {
            email: "benjaminfranklin@gmail.com",
            password: "risa123"
        }

        return await request(app).post("/api/v1/user/login").send(user).then((res) => {
            expect(res.statusCode).toBe(401);
            expect(res.body).toBeDefined();
        });
    });

    it("Login user FAILED: response with 401 as status code", async () => {
        const user = {
            email: "risa@gmail.com",
            password: "superman123"
        }

        return await request(app).post("/api/v1/user/login").send(user).then((res) => {
            expect(res.statusCode).toBe(401);
            expect(res.body).toBeDefined();
        });
    });

});
