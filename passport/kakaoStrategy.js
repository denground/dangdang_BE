// const passport = require("passport");
const kakaoStrategy = require('passport-kakao').Strategy
const User = require('../schemas/user')

module.exports = (passport) => {
    console.log("passport 진입");
    passport.use('kakao', new kakaoStrategy({
        clientID: process.env.CLIENTID,
        callbackURL: process.env.CALLBACKURL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const exUser = await User.findOne({email: profile._json.kakao_account.email});

            if (exUser) {
                if (exUser.provier === "kakao") {
                    done(null, exUser);
                } else {
                    done(null, false, { fail: "이미 카카오가 아닌 경로로 가입하셨습니다! 아이디, 비밀번호로 로그인 해주세요!"})
                }
            } else {
                const newUser = await User.create({
                    userID: profile.id,
                    email: profile._json.kakao_account.email,
                    nickname: profile.displayName,
                    provider: "kakao",
                });
                console.log(newUser);
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }))
}