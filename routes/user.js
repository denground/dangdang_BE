const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const userController = require('../controller/user');

// 회원가입 router
router.post('/users/signup', userController.userSignup);

// 카카오 로그인 API
router.post('/users/social', userController.socialLogin);

// 로그인 router
router.post('/users/login', userController.login);

// 회원인증 router
router.get('/users/auth', authMiddleWare, userController.auth);

module.exports = router;
