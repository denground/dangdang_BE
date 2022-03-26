const httpMocks = require('node-mocks-http');
const profileController = require('../../controller/profile');
const Profile = require('../../schemas/profile');
const MapModel = require('../../schemas/map');
const locals = require('../data/locals.json');
const profileCreate = require('../data/profileCreate.json');
const profileUpdateOneNotFile = require('../data/profileUpdateOneNotFile.json');
const profileUpdateOneIsFile = require('../data/profileUpdateOneIsFile.json');
const profileFind = require('../data/profileFind.json');
const mapsFind = require('../data/mapsFind.json');

Profile.create = jest.fn();
Profile.updateOne = jest.fn();
Profile.find = jest.fn();
MapModel.find = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
    res.locals.user = locals;
});

test('견종 등록', async () => {
    req.file =
        'https://dangdangss-s3-bucket.s3.ap-northeast-2.amazonaws.com/6911647512202388.png';
    req.body = profileCreate;
    Profile.create.mockResolvedValue(profileCreate);
    await profileController.savedog(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        success: '정보가 등록되었습니다.',
    });
});
test('반려동물 내용 수정 (req.file 없을 때)', async () => {
    req.body = profileUpdateOneNotFile;
    Profile.updateOne.mockResolvedValue(profileUpdateOneNotFile);
    await profileController.modifyMypage(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        success: '정보가 수정되었습니다.',
    });
});
test('반려동물 내용 수정 (req.file 있을 때)', async () => {
    req.file =
        'https://dangdangss-s3-bucket.s3.ap-northeast-2.amazonaws.com/6911647512202388.png';
    req.body = profileUpdateOneIsFile;
    Profile.updateOne.mockResolvedValue(profileUpdateOneIsFile);
    await profileController.modifyMypage(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        success: '정보가 수정되었습니다.',
    });
});
test('마이페이지 메인 (profile에 자료 없을 때)', async () => {
    Profile.find.mockResolvedValue([null]);
    MapModel.find.mockResolvedValue(mapsFind);
    await profileController.mypageMain(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        fail: '데이터가 존재하지 않습니다.',
    });
});
test('마이페이지 메인', async () => {
    Profile.find.mockResolvedValue(profileFind);
    MapModel.find.mockResolvedValue(mapsFind);
    await profileController.mypageMain(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
        userData: profileFind[0],
        mapData: mapsFind,
    });
});
