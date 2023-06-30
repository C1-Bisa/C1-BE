const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("GET /api/v1/notification",() => {
    let jwtTokenUser = ''
    beforeAll(async () => {
        const user = {
            email: "risa@gmail.com",
            password: "risa123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenUser = response.body.data.token;
      });
    
    it("Get All Notif user success response with 200 as status code", async () => {
        return await request(app).get("/api/v1/notification").set("Authorization", `Bearer ${jwtTokenUser}`).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Read All Notif user success response with 200 as status code", async () => {
        return await request(app).get("/api/v1/notification/update").set("Authorization", `Bearer ${jwtTokenUser}`).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    });

    it("Get All Notif user FAILED: Need authorization response with 401 as status code", async () => {

        return await request(app).get("/api/v1/notification").then((res) => {
            expect(res.statusCode).toBe(401);
            expect(res.body).toBeDefined();
        });
    });

    it("Get All Notif user FAILED: Invalid Token response with 401 as status code", async () => {
        let jwtTokenUserss = "wysmklanvls"

        return await request(app).get("/api/v1/notification").set("Authorization", `Bearer ${jwtTokenUserss}`).then((res) => {
            expect(res.statusCode).toBe(401);
            expect(res.body).toBeDefined();
        });
    });

});
