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
        , `${process.env.TOKEN_SECRET_KEY}`)
    // console.log("token : ", token);
    // 세션에 정보 저장
    req.session['token'] = token
    // console.log("session : ", req.session["token"]);
    // res.json({
    //     msg: '카카오 로그인 성공..!',
    //     token_cookie,
    // })
    // res.cookie(`${process.env.COOKIE}`, token)
    // console.log(req.cookies);
    // console.log("Is cookie go??? : ", res.cookie.set-cookie);
    res.redirect('https://sour-rat-84.loca.lt/main')
    res.send({success: `${req.user.userID}님 환영합니다!`, token});
    // res.send({success: `${req.user.userID}님 환영합니다!`, token});
})

// 로그인 router
router.post('/users/login', userController.login);

// 회원인증 router
router.get('/users/auth', authMiddleWare, userController.auth);

module.exports = router;
