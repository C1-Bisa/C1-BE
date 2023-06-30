const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("PUT /api/v1/user/verification", () => {
    let kodeOTP = ''
    beforeAll(async () => {
        const user = {
            name: "messi",
            email: "benbambang2@gmail.com",
            phone: "08124125215",
            password: "ronaldo12345"
        }
        const response = await request(app).post('/api/v1/user/register').send(user);
        kodeOTP = response.body.data.otp;
      });

    it("Verification new user with otp response with 200 as status code", async () => {
        const payload = {
            OTPinput: kodeOTP
        }
        return await request(app).put("/api/v1/user/verification").send(payload).then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Verification new user with otp FAILED: response with 422 as status code", async () => {
        const payload = {
            OTPinput: `${kodeOTP}2`
        }
        return await request(app).put("/api/v1/user/verification").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 

})