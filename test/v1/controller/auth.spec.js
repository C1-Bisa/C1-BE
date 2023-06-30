const { getProfile, updateNotif } = require('../../../app/controllers/api/v1/authController');

describe('getProfile', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        email: 'risa@gmail.com',
        phone: 'risa123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return user profile with status 200', () => {
    getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      message: 'Success',
      data: {
        email: 'risa@gmail.com',
        phone: 'risa123',
      },
    });
  });

  test('should return error response with status 404', () => {
    const errorMessage = 'User not found';
    const error = new Error(errorMessage);
    error.statusCode = 404;

    jest.spyOn(res, 'status').mockImplementationOnce(() => {
      throw error;
    });

    getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'FAIL',
      message: errorMessage,
    });
  });
});


  