const request = require("supertest");
const app = require ("../../../../../app");

jest.useFakeTimers('legacy')

describe("DELETE /api/v1/airline/:id",() => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Delete data Airline success response with 200 as status code", async () => {

        return await request(app).delete("/api/v1/airline/7").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
            expect(res.statusCode).toBe(200);
        });
    });

    it("Delete data Airline FAILED: FLight data not found 422", async () => {
        return await request(app).delete("/api/v1/airline/100000").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    })

    it('should return error response with status 422', async () => {
      
        const response = await request(app)
          .delete('/api/v1/airline/3')
          .set("Authorization", `Bearer ${jwtTokenAdmin}`)
          .expect(422);
      
        expect(response.status).toBe(422);
        expect(response.body).toEqual({
          status: 'FAIL',
        });
    });

    it("Delete data Airline FAILED: Unauthorized", async () => {
        return await request(app).delete("/api/v1/airline/2").then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
});