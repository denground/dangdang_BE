const guideController = require('../../controller/guide');
const Guide = require('../../schemas/guide');
const guideFind = require('../data/guideFind.json');
const guideFindById = require('../data/guideFindById.json');
const httpMocks = require('node-mocks-http');

Guide.find = jest.fn();
Guide.findById = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('가이드 정보 출력', () => {
    test('메인 화면에는 모든 가이드 항목에 대한 title과 image가 나온다!', async () => {
        Guide.find.mockReturnValue(guideFind);
        await guideController.guideMain(req, res, next);
        expect(res._getJSONData()).toStrictEqual(guideFind);
    });
    test('디테일 화면에는 각 항목에 대하여 guideTitleImage를 제외한 모든 자료가 나온다!', async () => {
        req.params.postNumber = '62237919d9354720193cc7b6';
        Guide.findById.mockReturnValue(guideFindById);
        await guideController.guideDetail(req, res, next);
        expect(res._getJSONData()).toStrictEqual(guideFindById);
    });
});
