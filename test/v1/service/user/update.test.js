const request = require("supertest");
const app = require ("../../../../app");
const userRepository = require("../../../../app/repositories/userRepository")
const userService = require("../../../../app/services/userService")

jest.useFakeTimers('legacy')

describe("PUT /api/v1/user/update",() => {
    let jwtToken = ''
    beforeAll(async () => {
        const user = {
            email: "risa@gmail.com",
            password: "risa123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtToken = response.body.data.token;
      });

      test('should throw an error if email is provided', async () => {
        const payload = {
            email: "risa21@gmail.com"
        }
        return await request(app).put("/api/v1/user/update").set("Authorization", `Bearer ${jwtToken}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(400);
        });
    
      });
    
      test('should throw an error if password is provided', async () => {
        const payload = {
            password: "risa2345"
        }
        return await request(app).put("/api/v1/user/update").set("Authorization", `Bearer ${jwtToken}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(400);
        });
      });

      test('should throw an error if nama is not provided', async () => {
        const payload = {
            phone: "082132830954"
        }

        return await request(app).put("/api/v1/user/update").set("Authorization", `Bearer ${jwtToken}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(400);
        });

      });
      test('should throw an error if phone is not provided', async () => {
        const payload = {
            nama: "Risa Comel"
        }

        return await request(app).put("/api/v1/user/update").set("Authorization", `Bearer ${jwtToken}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(400);
        });

      });
      
      test("Update profile user success response with 200 as status code", async () => {
        const payload = {
            nama: "Risa irma",
            phone: '082132830959'
        }
        return await request(app).put("/api/v1/user/update").set("Authorization", `Bearer ${jwtToken}`).send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
        });
      });
});
