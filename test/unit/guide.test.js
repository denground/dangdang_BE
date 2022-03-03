const guideController = require('../../controller/guide');
const guideModel = require('../../schemas/guide');
const httpMocks = require('node-mocks-http');

const productId = 'testCode';
const updatedProduct = {
  name: 'updated name',
  description: 'updated description',
};

guideModel.find = jest.fn();

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
});
