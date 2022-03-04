// description update, 산책일지 전체 조회, 반려동물 사진 보내주기, 산책 정보 저장 要
const mapController = require('../../controller/map');
const mapModel = require('../../schemas/map');
const profileModel = require('../../schemas/profile');
const httpMocks = require('node-mocks-http');
const oneprofile = require('../data/one-profile.json');
const onemap = require('../data/one-map.json');

mapModel.find = jest.fn();
mapModel.findOne = jest.fn();
profileModel.findOne = jest.fn();
mapModel.findOneAndUpdate = jest.fn();
mapModel.create = jest.fn();

const updatedMap = {
  description: 'updated description',
};

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Map Controller Update', () => {
  test('should have an updateMap function', async () => {
    expect(typeof mapController.updateMap).toBe('function');
  });
  test('should return json body and response code 200', async () => {
    mapModel.findOneAndUpdate.mockReturnValue(updatedMap);
    await mapController.updateMap(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toBeTruthy();
  });
  test('should handle 400 when image dosent exist', async () => {
    mapModel.findOneAndUpdate.mockReturnValue(null);
    await mapController.updateMap(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
  test('should handle Errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    mapModel.findOneAndUpdate.mockReturnValue(rejectedPromise);
    await mapController.updateMap(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('Map Controller GET', () => {
  test('should have a getMap function', () => {
    expect(typeof mapController.showImage).toBe('function');
  });
  test('should call mapModel.findOne({})', async () => {
    await mapController.showImage(req, res, next);
    expect(profileModel.findOne).toHaveBeenCalledWith(
      { userID: undefined },
      'petImage'
    );
  });
  test('should return 200 response', async () => {
    await mapController.showImage(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  test('should return json body in response', async () => {
    profileModel.findOne.mockReturnValue(oneprofile);
    await mapController.showImage(req, res, next);
    expect(res._getJSONData()).toStrictEqual(oneprofile);
  });
  test('should handle error', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    profileModel.findOne.mockReturnValue(rejectedPromise);
    await mapController.showImage(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe('Map Controller Create', () => {
  beforeEach(() => {
    req.body = onemap;
  });
  test('should have a createMap function', () => {
    expect(typeof mapController.saveMap).toBe('function');
  });
  test('should return status Code 200', async () => {
    await mapController.saveMap(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  test('should return json body in response', async () => {
    mapModel.create.mockReturnValue(onemap);
    await mapController.saveMap(req, res, next);
    expect(res._getJSONData()).toStrictEqual(onemap);
  });
  test('should handle error', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    mapModel.create.mockReturnValue(rejectedPromise);
    await mapController.saveMap(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
