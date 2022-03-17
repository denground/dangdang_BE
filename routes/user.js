const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth-middleware');
const userController = require('../controller/user');
const passport = require('passport');
const jwt = require("jsonwebtoken");

// 회원가입 router
router.post('/users/signup', userController.userSignup);

// 카카오 로그인 API
router.get('/users/kakao', userController.socialLogin);
router.post('/users/kakao', userController.kakaoLogin);

// passport-kakao Login
// router.get('/kakao', passport.authenticate('kakao-login'));
// router.get(
//     '/auth/kakao/callback',
//     passport.authenticate('kakao-login', {
//         failureRedirect: '/',
//     }),
//     (req, res) => {
//         const token = jwt.sign(
//             { userID: req.user.userID, nickname: req.user.nickname },
//             process.env.TOKEN_SECRET_KEY
//         );
//         // 세션에 정보 저장
//         req.session.token = token;
//         console.log("token : " + req.session.token);
//         req.session.save(function() {
//             res.cookie(`${process.env.COOKIE}`, token);
//             res.redirect('https://bitter-yak-42.loca.lt/main');
//         })
//         // res.json({
//         //     msg: '카카오 로그인 성공..!',
//         //     token_cookie,
//         // })
//     }
// );

// 로그인 router
router.post('/users/login', userController.login);

// 회원인증 router
router.get('/users/auth', authMiddleWare, userController.auth);

module.exports = router;
