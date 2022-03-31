// const passport = require("passport");
const kakaoStrategy = require('passport-kakao').Strategy
const User = require('../schemas/user')

module.exports = (passport) => {
    passport.use('kakao', new kakaoStrategy({
        clientID: process.env.CLIENTID,
        callbackURL: process.env.CALLBACKURL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const exUser = await User.findOne({userID: profile.id});

            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    userID: profile.id,
                    nickname: profile.displayName,
                    provider: "kakao",
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }))
}