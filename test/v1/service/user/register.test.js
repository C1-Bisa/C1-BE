const request = require("supertest");
const app = require ("../../../../app");

jest.useFakeTimers('legacy')

describe("POST /api/v1/user/register",() => {

    it("Create new user or register user response with 201 as status code", async () => {
        const payload = {
            name: "messi",
            email: "benbambang1@gmail.com",
            phone: "08124125215",
            password: "messi12345"
        }
        return await request(app).post("/api/v1/user/register").send(payload).then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Create new user or register user FAILED: Name is required !! response with 422 as status code", async () => {
        const payload = {
            email: "benbambang439@gmail.com",
            phone: "08124125215",
            password: "messi12345"
        }
        return await request(app).post("/api/v1/user/register").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Create new user or register user FAILED: Use gmail pattern for register Email! response with 422 as status code", async () => {
        const payload = {
            name: "messi",
            email: "benbambang439@ymail.com",
            phone: "08124125215",
            password: "messi12345"
        }
        return await request(app).post("/api/v1/user/register").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Create new user or register user FAILED: email is required !! response with 422 as status code", async () => {
        const payload = {
            name: "messi",
            phone: "08124125215",
            password: "messi12345"
        }
        return await request(app).post("/api/v1/user/register").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Create new user or register user FAILED: number phone is required !! response with 422 as status code", async () => {
        const payload = {
            name: "messi",
            email: "benbambang439@gmail.com",
            password: "messi12345"
        }
        return await request(app).post("/api/v1/user/register").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Create new user or register user FAILED: password is required response with 422 as status code", async () => {
        const payload = {
            name: "messi",
            email: "benbambang439@gmail.com",
            phone: "08124125215"
        }
        return await request(app).post("/api/v1/user/register").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Create new user or register user FAILED: password must fill with 8 character response with 422 as status code", async () => {
        const payload = {
            name: "messi",
            email: "benbambang439@gmail.com",
            phone: "08124125215",
            password: "me"
        }
        return await request(app).post("/api/v1/user/register").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 

    it("Create new user or register user FAILED: Email has been taken !! response with 422 as status code", async () => {
        const payload = {
            name: "messi",
            email: "risa@gmail.com",
            phone: "08124125215",
            password: "risa123"
        }
        return await request(app).post("/api/v1/user/register").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
            expect(res.body).toBeDefined();
        });
    }); 

});
