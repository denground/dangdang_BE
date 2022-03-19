const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const userController = require('../controller/user');
const passport = require('passport');
const jwt = require("jsonwebtoken");

// 회원가입 router
router.post('/users/signup', userController.userSignup);

// 로그인 router
router.post('/users/login', userController.login);

// 회원인증 router
router.get('/users/auth', authMiddleWare, userController.auth);

// passport-kakao Login
router.get('/kakao', passport.authenticate('kakao'));
router.get('/auth/kakao/callback', (req, res, next) => {
    console.log("kakao callback 진입");
    console.log("req.query : " + JSON.stringify(req.query));
    passport.authenticate('kakao', {
        failureRedirect: '/',
    }, (err, user, info) => {
        if (err) return res.status(401).send(err);
        const { userID, nickname } = user;
        const token = jwt.sign(
            { userID: userID, nickname: nickname },
            process.env.TOKEN_SECRET_KEY
        );
        console.log("kakao token: " + token);
        res.send({ token, success: "카카오 로그인 성공!" });
    }) (req, res, next);
});

module.exports = router;


