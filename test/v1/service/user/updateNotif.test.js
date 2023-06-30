const request = require('supertest');
const app = require('../../../../app'); 
const userService = require("../../../../app/services/userService")


describe('Notification API', () => {
  
  describe('GET /api/v1/notification/update', () => {
    let jwtToken = ''
    beforeAll(async () => {
        const user = {
            email: "risa@gmail.com",
            password: "risa123"
        }
        const response = await request(app).post('/api/v1/user/login').send(user);
        jwtToken = response.body.data.token;
      });

    it('should update notification and return success response', async () => {
      const response = await request(app)
        .get('/api/v1/notification/update')
        .set("Authorization", `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should return error response if user data is missing', async () => {
      userService.updateNotif = jest.fn().mockResolvedValue({
        status: 'FAIL',
        message: 'User data is missing',
      });
    
      const response = await request(app)
        .get('/api/v1/notification/update')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(422);
    
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        status: 'FAIL',
        message: 'User data is missing',
      });
    });

    it(" FAILED: Unauthorized", async () => {
        return await request(app).get("/api/v1/notification/update").then((res) => {
            expect(res.statusCode).toBe(401);
        });
    })
  });
});
