const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const userController = require('../controller/user');
const passport = require('passport');
const jwt = require("jsonwebtoken");

// 회원가입 router
router.post('/users/signup', userController.userSignup);

// passport-kakao Login
router.get('/kakao', passport.authenticate('kakao-login'));
router.get('/users/kakao', (req, res, next) => {
    console.log("kakao callback 진입");
    passport.authenticate('kakao-login', {
        failureRedirect: '/',
    }), (err, user, info) => {
        if (err) return console.log(err);
        const { userID, nickname } = user;
        const token = jwt.sign(
            { userID: userID, nickname: nickname },
            process.env.TOKEN_SECRET_KEY
        );
        console.log("kakao token: " + token);
        res.send({ token, success: "카카오 로그인 성공!" });
    }
});

// 로그인 router
router.post('/users/login', userController.login);

// 회원인증 router
router.get('/users/auth', authMiddleWare, userController.auth);

module.exports = router;
