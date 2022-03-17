const kakao = require('./kakaoStrategy')
const passport = require('passport')
const User = require('../schemas/user')

module.exports = () => {
    console.log("index.js 진입");
    // 세션에 사용자 정보 저장
    passport.serializeUser((user, done) => {
        done(null, {id: user.userID, accessToken: user.accessToken})
    })

    // 매 요청마다 실행되며
    passport.deserializeUser((id, done) => {
        User.findOne({ where: {id} })
            .then(user => {
                done(null, user)})
            .catch(err => done(err))
    })

    // local(passport)
    kakao(passport)
}