const emailController = require('../../controller/email');
const httpMocks = require('node-mocks-http');
const newEmail = require('../data/new-email.json');

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe('Email Controller', () => {
  beforeEach(() => {
    req.body = newEmail;
  });
  test('type === function', () => {
    expect(typeof emailController.sendEmail).toBe('function');
  });
  // test('status code 201 && send === true ?', async () => {
  //   await emailController.sendEmail(req, res, next);
  //   expect(res.statusCode).toBe(200);
  //   expect(res._isEndCalled()).toBeTruthy();
  // });
});
