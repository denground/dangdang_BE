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
            console.log("accessToken : " + accessToken);
            const exUser = await User.findOne({userID: profile.id})

            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    userID: profile.id,
                    email: profile._json.kakao_account.email,
                    nickname: profile.displayName,
                })
                console.log(newUser);
                done(null, newUser)
            }
        } catch (error) {
            console.error(error)
            done(error)
        }
    }))
}