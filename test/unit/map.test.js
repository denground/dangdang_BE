const httpMocks = require('node-mocks-http');
const mapController = require('../../controller/map');
const Maps = require('../../schemas/map');
const userModel = require('../../schemas/user');
const Profile = require('../../schemas/profile');
const locals = require('../data/locals.json');
const profileFindOneFir = require('../data/profileFindOneFir.json');
const profileFindOneSec = require('../data/profileFindOneSec.json');
const mapsCreateBody = require('../data/mapsCreate(body).json');
const mapsCreateResponse = require('../data/mapsCreate(response).json');
const mapsFind = require('../data/mapsFind.json');

Profile.findOne = jest.fn();
Maps.find = jest.fn();
Maps.create = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
    res.locals.user = locals;
});
test('반려동물 사진 보내주기 (일시정지 클릭 시)', async () => {
    Profile.findOne.mockReturnValue(profileFindOneFir);
    await mapController.showImage(req, res, next);
    expect(res._getJSONData()).toStrictEqual(profileFindOneFir);
});
test('산책 정보 저장 (산책종료 클릭 시)', async () => {
    req.body = mapsCreateBody;
    Maps.create.mockReturnValue(mapsCreateBody);
    await mapController.saveMap(req, res, next);
    expect(res._getJSONData()).toStrictEqual(mapsCreateResponse);
});
test('산책 종료 페이지 내용', async () => {
    const [recentData] = Maps.find.mockReturnValue(mapsFind);
    const mypetName = Profile.findOne.mockReturnValue(profileFindOneSec);
    await mapController.showData(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        recentData: recentData,
        mypetName: mypetName,
    });
});
