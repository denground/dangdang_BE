const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const userController = require('../controller/user');
const passport = require('passport')
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 회원가입 router
router.post('/users/signup', userController.userSignup);

// 카카오 로그인 API
router.post('/users/social', userController.socialLogin);

// passport-kakao Login
router.get('/kakao', passport.authenticate('kakao-login'))
router.get('/auth/kakao/callback', passport.authenticate('kakao-login',
    {
        failureRedirect: '/',
    }), (req, res) => {
    const token = jwt.sign({userID: req.user.userID, nickname: req.user.nickname,}
        , process.env.TOKEN_SECRET_KEY)
    // 세션에 정보 저장
    req.session['token'] = token
    // res.json({
    //     msg: '카카오 로그인 성공..!',
    //     token_cookie,
    // })
    console.log(req.session)

    res.cookie(process.env.COOKIE, {token})
    res.redirect('https://big-wombat-43.loca.lt/main')
})

// 로그인 router
router.post('/users/login', userController.login);

// 회원인증 router
router.get('/users/auth', authMiddleWare, userController.auth);

module.exports = router;
