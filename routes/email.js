const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const User = require('../schemas/user')
const CryptoJS = require("crypto-js");


// ID 찾을 때 보내주는 메일
router.post('/users/find', async (req, res) => {
    try {
        const {userID, email} = req.body

        // 이메일 입력없으면 400메세지
        if (!email) return res.status(400).json({
            errorMessage: '이메일을 입력해주세요.'
        })

        // 메일을 보내는 gmail 계정
        const EMAIL = process.env.EMAIL
        const EMAIL_PASSWORD = process.env.PASSWORD

        // 유저를 불러온다.
        const user = await User.findOne({
            email,
        })

        // 이메일 수신자 (ID 찾는 유저)
        let receiverEmail = user.email

        // 보낼 내용
        let mailOptions = ``

        // 아이디 입력이 없는 경우
        if (!userID) {

            // 전송할 email 내용 작성
            mailOptions = {
                from: EMAIL,
                to: receiverEmail,
                subject: '찾으시는 ID 입니다.',
                html: `<h1>회원님의 아이디는 ${user.userID} 입니다.</h1>`
            }
        }

        // 아이디 입력이 있는 경우
        if (userID) {
            // password 찾기
            if (user.userID !== userID) {
                return res.status(400).json({
                    errorMessage: '가입한 아이디 이메일을 입력해주세요.'
                })
            } else {
                // Password 복호화
                const bytes = CryptoJS.AES.decrypt(user.password, process.env.PRIVATE_KEY)
                const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                console.log(decrypted)
                // 전송할 email 내용 작성
                mailOptions = {
                    from: EMAIL,
                    to: receiverEmail,
                    subject: '찾으시는 PASSWORD 입니다..',
                    html: `<h1>${user.userID}님의 비밀번호는 ${decrypted} 입니다.</h1>`
                }
            }
        }

        // transport 생성
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD,
            }
        })

        // email 전송
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error)
            }
            console.log('send mail success')
        })

        res.status(200).json({
            msg: '메일 전송완료!'
        })

    } catch (err) {
        res.status(400).json({
            errorMessage: '다시 입력해주세요.'
        })
    }
})


module.exports = router