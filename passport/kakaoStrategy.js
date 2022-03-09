const kakaoStrategy = require('passport-kakao').Strategy
const User = require('../schemas/user')

module.exports = (passport) => {
    passport.use('kakao-login', new kakaoStrategy({
        clientID: process.env.CLIENTID,
        callbackURL: process.env.CALLBACKURL,
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('refreshToken ====================', refreshToken)
        console.log('accessToken ====================', accessToken)
        console.log('kakao profile ====================', profile)
        console.log('============================================')
        console.log('============================================')
        console.log('============================================')

        try {
            const exUser = await User.findOne({userID: profile.id})
            const tokenUser = {
                user: exUser,
                accessToken: accessToken || '',
            }
            console.log("exUser : ", exUser)
            if (exUser) {
                done(null, tokenUser)
            } else {
                const newUser = await User.create({
                    userID: profile.id,
                    email: profile._json.kakao_account.email,
                    nickname: profile.displayName,
                })
                done(null, newUser)
            }
        } catch (error) {
            console.error(error)
            done(error)
        }
    }))
}