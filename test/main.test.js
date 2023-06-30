const request = require("supertest");
const app = require ("../app");

jest.useFakeTimers('legacy')

describe("Handling Error 404 and 500",() => {
    
    it("Error success route not found response with 404 as status code", async () => {
        const user = {
            email: "risa@gmail.com",
            password: "risa123"
        }

        return await request(app).post("/api/v1/user/logindekk").send(user).then((res) => {
            expect(res.statusCode).toBe(404);
            expect(res.body).toBeDefined();
        });
    });

    it("Error success Bad request response with 500 as status code", async () => {

        return await request(app).get("/api/v1/errors").then((res) => {
            expect(res.statusCode).toBe(500);
            expect(res.body).toBeDefined();
        });
    });

});
