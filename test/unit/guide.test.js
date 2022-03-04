const guideController = require('../../controller/guide');
const guideModel = require('../../schemas/guide');
const httpMocks = require('node-mocks-http');

const postNumber = 'testCode';

guideModel.find = jest.fn();
guideModel.findById = jest.fn();

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Guide Controller GET', () => {
  test('should have a getGuide function', () => {
    expect(typeof guideController.guideMain).toBe('function');
  });
  test('should call guideModel.find({})', async () => {
    await guideController.guideMain(req, res, next);
    expect(guideModel.find).toHaveBeenCalledWith({});
  });
  test('should return 200 response', async () => {
    await guideController.guideMain(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  test('should return json body in response', async () => {
    await guideController.guideMain(req, res, next);
    expect(res._getJSONData).toBeTruthy();
  });
  test('should handle error', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    guideModel.find.mockReturnValue(rejectedPromise);
    await guideController.guideMain(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('Guide Controller GetById', () => {
  test('should have a getGuideById', () => {
    expect(typeof guideController.guideDetail).toBe('function');
  });
  test('should call productModel.findeById', async () => {
    req.params.postNumber = postNumber;
    await guideController.guideDetail(req, res, next);
    expect(guideModel.findById).toBeCalledWith(postNumber);
  });
  test('should return json body and response code 200', async () => {
    await guideController.guideDetail(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData).toBeTruthy();
    expect(res._isEndCalled).toBeTruthy();
  });
  test('should handle Error', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    guideModel.findById.mockReturnValue(rejectedPromise);
    await guideController.guideDetail(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
