const profileController = require('../../controller/profile');
const profileModel = require('../../schemas/profile');
const httpMocks = require('node-mocks-http');
const oneprofile = require('../data/one-profile.json');

profileModel.create = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Profile Controller Create', () => {
  beforeEach(() => {
    req.body = oneprofile;
  });
  test('should have a create function', () => {
    expect(typeof profileController.savedog).toBe('function');
  });
  test('should call profileModel.Create', async () => {
    await profileController.savedog(req, res, next);
    expect(profileModel.create).toBeTruthy();
  });
  test('should return status 200', async () => {
    await profileController.savedog(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  test('should return json body in response', async () => {
    profileModel.create.mockReturnValue(oneprofile);
    await profileController.savedog(req, res, next);
    expect(res._getJSONData()).toStrictEqual(oneprofile);
  });

  test('should handle error', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    profileModel.create.mockReturnValue(rejectedPromise);
    await profileController.savedog(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
