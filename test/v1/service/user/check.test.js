const request = require("supertest");
const app = require ("../../../../app");
const userRepository = require("../../../../app/repositories/userRepository")
const userService = require("../../../../app/services/userService")

jest.useFakeTimers('legacy')

describe("PUT /api/v1/user/verification",() => {
    
    test('should return error message if OTP code is wrong', async () => {
        const payload = {
            OTPinput: '123456',
        }
        return await request(app).put("/api/v1/user/verification").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    
    });

    test('should return error message if OTP code is expired', async () => {
        const payload = {
            OTPinput: '123456',
        }
        // Simulasikan OTP yang sudah kadaluarsa
        userRepository.findOtp = jest.fn().mockResolvedValue({
            expiredDate: Date.now() - 100000, // Set expired date to the future
        });

        return await request(app).put("/api/v1/user/verification").send(payload).then((res) => {
            expect(res.statusCode).toBe(422);
        });
    
    });

    it('should return the verification result', async () => {
        // Persiapan data dan stub repository
        const reqBody = {
          OTPinput: '123456',
        };
    
        const OTPdatabase = {
          userId: '4',
          expiredDate: Date.now() + 60000, // Expired dalam 1 menit dari sekarang
        };
    
        const verif = {
          isVerified: true,
        };
    
        const expectedResponse = {
          subject: 'Verification OTP',
          message: 'Registrasi Berhasil',
          data: verif,
        };
    
        userRepository.findOtp = jest.fn().mockResolvedValue(OTPdatabase);
        userRepository.updateUser = jest.fn().mockResolvedValue(verif);
        userRepository.createNotif = jest.fn().mockResolvedValue();
    
        // Jalankan permintaan menggunakan Supertest
        const response = await request(app).put('/api/v1/user/verification') // Gantikan dengan rute yang sesuai
          .send(reqBody);
    
        // Verifikasi respons
        expect(response.statusCode).toBe(200);
       
    });

    it('should throw an error if an error occurs during verification', async () => {
        const reqBody = {
          OTPinput: '123456',
        };
      
        const expectedError = new Error('Failed to verify OTP');
      
        userRepository.findOtp = jest.fn().mockRejectedValue(expectedError);
      
        await expect(userRepository.findOtp(reqBody)).rejects.toThrow(expectedError);
        expect(userRepository.findOtp).toHaveBeenCalledWith(reqBody);

    });
      

    
});
