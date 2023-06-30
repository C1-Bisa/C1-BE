const request = require("supertest");
const app = require ("../../../../app");
const userRepository = require("../../../../app/repositories/userRepository")

jest.useFakeTimers('legacy')

describe("DELETE /api/v1/user/delete/:id",() => {
    let jwtTokenAdmin = ''
    beforeAll(async () => {
        const user = {
            email: "admin@gmail.com",
            password: "admin123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtTokenAdmin = response.body.data.token;
      });

    it("Delete data User success response with 200 as status code", async () => {

        userRepository.deleteNotif = jest.fn();
        userRepository.delete = jest.fn().mockResolvedValue();

        return await request(app).delete("/api/v1/user/delete/9").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
            expect(res.statusCode).toBe(200);
        });
    });

    // it("Delete data User FAILED: User data not found", async () => {
    //     return await request(app).delete("/api/v1/airline/100000").set("Authorization", `Bearer ${jwtTokenAdmin}`).then((res) => {
    //         expect(res.statusCode).toBe(422);
    //     });
    // })

    it("Delete data User FAILED: Unauthorized", async () => {
        return await request(app).delete("/api/v1/user/delete/3").then((res) => {
            expect(res.statusCode).toBe(403);
        });
    })
});