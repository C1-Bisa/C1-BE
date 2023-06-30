const request = require("supertest");
const app = require ("../../../../app");
const userRepository = require("../../../../app/repositories/userRepository")
const userService = require("../../../../app/services/userService")
const bcrypt = require('bcrypt');

jest.useFakeTimers('legacy')

describe("PUT /api/v1/user/createNewPassword",() => {

    afterEach(() => {
        jest.restoreAllMocks();
      });


    test('should return error message if token is wrong', async () => {
        const reqQuery = {
            token: 'qeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibmFtYSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjg2NDEwNDk3LCJleHAiOjE2ODY0MTQwOTd9.l3m_IH5n699opbDRMAZ_0MhtoYl4ROP3zcjYRWc1oZw',
          };
          const reqBody = {
            newPassword: '12345678',
          };

          userRepository.findToken = jest.fn().mockResolvedValue({
            verifiedToken: null,
            expiredDate: Date.now() + 60000,
          });
          bcrypt.compare = jest.fn().mockResolvedValue(false);
        
          const response = await request(app)
            .put('/api/v1/user/createNewPassword')
            .query(reqQuery)
            .send(reqBody);
            expect(response.statusCode).toBe(422);
    
    });

    it('should return error message if password length is less than 8', async () => {
        const reqQuery = {
          token: 'valid_token',
        };
    
        const reqBody = {
          newPassword: '1234567', // Password length less than 8
        };
    
    
        userRepository.findToken.mockResolvedValue({ verifiedToken: 'valid_token' });
        // comparePassword.mockResolvedValue(true);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
    
        const response = await request(app)
        .put('/api/v1/user/createNewPassword')
        .query(reqQuery)
        .send(reqBody);
        expect(response.statusCode).toBe(422);
        
    });

    it('should handle expired token', async () => {
      // Create a mock user object
     
      const mockUser = {
        id: 1,
        password: 'risa123',
      };

      userRepository.findToken = jest.fn().mockResolvedValue({
        verifiedToken: null,
        expiredDate: Date.now() - 10000,
      });
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      userRepository.findUser = jest.fn().mockResolvedValue(mockUser)
      userRepository.deleteOTP = jest.fn().mockResolvedValue(true)
  
      const response = await request(app)
        .put('/api/v1/user/createNewPassword')
        .query({ token: 'valid_token:mockUserId' })
        .send({ newPassword: 'risa123' });
  
      expect(response.status).toBe(422);
    });
  
    // it('Succes update password wit status 200', async () => {
    //   // Create a mock user object
    //   const reqQuery = {
    //     token: 'valid_token',
    //   };
  
    //   const mockUser = {
    //     id: 1,
    //     password: 'risa123',
    //   };

    //   const reqBody = {
    //     newPassword: 'risa123', // Password length less than 8
    //   };

    //   userRepository.findToken = jest.fn().mockResolvedValue({
    //     verifiedToken: {verifiedToken: 'valid_token'},
    //     expiredDate: Date.now() + 10000,
    //   });
    //   // bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
    //   userRepository.findUser = jest.fn().mockResolvedValue(mockUser)
    //   userRepository.deleteOTP = jest.fn().mockResolvedValue(true)
  
    //   const response = await request(app)
    //     .put('/api/v1/user/createNewPassword')
    //     .query({token: 'valid_token'})
    //     .send(reqBody);
  
    //   expect(response.status).toBe(200);

    // });
  

   
});
