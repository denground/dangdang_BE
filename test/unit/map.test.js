const httpMocks = require('node-mocks-http');
const mapController = require('../../controller/map');
const Maps = require('../../schemas/map');
const Profile = require('../../schemas/profile');
const locals = require('../data/locals.json');
const profileFindOneFir = require('../data/profileFindOneFir.json');
const profileFindOneSec = require('../data/profileFindOneSec.json');
const mapsCreateBody = require('../data/mapsCreate(body).json');
const mapsCreateResponse = require('../data/mapsCreate(response).json');
const mapsFind = require('../data/mapsFind.json');
const mapsFindSort = require('../data/mapsFindSort.json');
const mapsFindById = require('../data/mapsFindById.json');

Profile.findOne = jest.fn();
Maps.find = jest.fn();
Maps.findOne = jest.fn();
Maps.create = jest.fn();
Maps.findById = jest.fn();
Maps.deleteOne = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
    res.locals.user = locals;
});
test('반려동물 사진 보내주기 (일시정지 클릭 시)', async () => {
    Profile.findOne.mockResolvedValue(profileFindOneFir);
    await mapController.showImage(req, res, next);
    expect(res._getJSONData()).toStrictEqual(profileFindOneFir);
});
test('산책 정보 저장 (산책종료 클릭 시)', async () => {
    req.body = mapsCreateBody;
    Maps.create.mockResolvedValue(mapsCreateBody);
    await mapController.saveMap(req, res, next);
    expect(res._getJSONData()).toStrictEqual(mapsCreateResponse);
});
test('산책 종료 페이지 내용', async () => {
    Maps.find.mockImplementationOnce(() => ({
        sort: () => ({ limit: jest.fn().mockResolvedValue(mapsFindSort) }),
    }));
    Profile.findOne.mockReturnValue(profileFindOneSec);
    await mapController.showData(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        recentData: mapsFindSort[0],
        petname: profileFindOneSec,
    });
});
test('산책일지 불러오기 (메인) => 산책내역 없을 때!', async () => {
    Maps.find.mockResolvedValue(null);
    Profile.findOne.mockResolvedValue(profileFindOneFir);
    await mapController.showMap(req, res, next);
    expect(res._getJSONData()).toStrictEqual({ success: '산책 내역이 없어요' });
});
test('산책일지 불러오기 (메인) => 정상적으로 작동!', async () => {
    Maps.find.mockResolvedValue(mapsFind);
    Profile.findOne.mockResolvedValue(profileFindOneFir);
    await mapController.showMap(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        profileImage: profileFindOneFir,
        list: mapsFind,
    });
});
test('산책일지 불러오기 (상세)', async () => {
    req.params.mapsId = '623e3e7a583459be4bbc3e15';
    Maps.findById.mockResolvedValue(mapsFindById);
    await mapController.detailMap(req, res, next);
    expect(res._getJSONData()).toStrictEqual(mapsFindById);
});
test('산책일지 삭제', async () => {
    req.params.mapsId = '623e3e7a583459be4bbc3e15';
    await mapController.deleteMap(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        success: '산책일지가 삭제되었습니다.',
    });
});
