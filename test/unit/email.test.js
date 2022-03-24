const httpMocks = require('node-mocks-http');
const emailController = require('../../controller/email');
const User = require('../../schemas/user');
const notUser = require('../data/notUser.json');
const notID = require('../data/notID.json');
const isID = require('../data/isID.json');
const findOne = require('../data/userFindOne.json');
const updateOne = require('../data/userUpdateOne.json');

User.findOne = jest.fn();
User.updateOne = jest.fn();

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

describe('node-mailer를 통한 ID/PW 찾기', () => {
    test('이메일 입력값이 없으면 입력하라는 에러 발생!', async () => {
        await emailController.sendEmail(req, res, next);
        expect(res._getJSONData()).toStrictEqual({
            fail: '이메일을 입력해주세요.',
        });
    });

    test('유저 정보가 없으면 에러 발생', async () => {
        req.body.email = notUser;
        User.findOne.mockImplementation(() => {
            throw new Error();
        });
        await emailController.sendEmail(req, res, next);
        expect(res._getJSONData()).toStrictEqual({
            fail: '다시 입력해주세요.',
        });
    });
    test('ID 입력 없는 경우 ID 찾아줌', async () => {
        req.body = notID;
        User.findOne.mockReturnValue(findOne);
        await emailController.sendEmail(req, res, next);
        expect(res._getJSONData()).toStrictEqual({
            success: '아이디가 메일로 전송되었습니다.',
        });
    });

    test('ID 입력 있는 경우 PW 찾아줌', async () => {
        req.body = isID;
        User.findOne.mockReturnValue(findOne);
        User.updateOne.mockReturnValue(updateOne);
        await emailController.sendEmail(req, res, next);
        expect(res._getJSONData()).toStrictEqual({
            success: '임시 비밀번호가 메일로 전송되었습니다.',
        });
    });
});
