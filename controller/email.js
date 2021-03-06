const nodemailer = require("nodemailer");
const User = require("../schemas/user");
const CryptoJS = require("crypto-js");
require("dotenv").config();

exports.sendEmail = async (req, res, next) => {
    try {
        const { userID, email } = req.body;

        // 이메일 입력없으면 400메세지
        if (!email)
            return res.status(400).json({
                fail: "이메일을 입력해주세요.",
            });

        // 메일을 보내는 gmail 계정
        const EMAIL = process.env.EMAIL;
        const EMAIL_PASSWORD = process.env.PASSWORD;

        // 유저를 불러온다.
        const user = await User.findOne({
            email,
        });

        // 이메일 수신자 (ID 찾는 유저)
        let receiverEmail = user.email;

        // 보낼 내용
        let mailOptions = ``;

        // transport 생성
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD,
            },
        });

        // 아이디 입력이 없는 경우
        if (!userID) {
            // 전송할 email 내용 작성
            mailOptions = {
                from: EMAIL,
                to: receiverEmail,
                subject: "찾으시는 ID 입니다.",
                text: `회원님의 아이디는 ${user.userID} 입니다.`,
            };

            // email 전송
            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return;
                }
            });
            res.status(200).json({
                success: "아이디가 메일로 전송되었습니다.",
            });
        }

        // 아이디 입력이 있는 경우
        if (userID) {
            // password 찾기
            if (user.userID !== userID) {
                return res.status(400).json({
                    fail: "가입한 아이디 이메일을 입력해주세요.",
                });
            } else {
                // 임시 비밀번호 생성
                function createCode(iLength) {
                    let characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^*_-";
                    let randomStr = "";
                    for (let i = 0; i < iLength; i++) {
                        randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                    return randomStr;
                }
                let randomPw = createCode(12);

                // AES 알고리즘 암호화
                const encrypted = CryptoJS.AES.encrypt(
                    JSON.stringify(randomPw),
                    process.env.PRIVATE_KEY
                ).toString();

                await User.updateOne(
                    { userID: user.userID },
                    { $set: { password: encrypted } }
                );

                // 전송할 email 내용 작성
                mailOptions = {
                    from: EMAIL,
                    to: receiverEmail,
                    subject: "찾으시는 PASSWORD 입니다.",
                    text: `${user.userID}님의 비밀번호는 ${randomPw} 입니다.
                    임시 비밀번호이니, 로그인 후 비밀번호를 꼭 변경하세요!`,
                };
                // email 전송
                transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                });
                res.status(200).json({
                    success: "임시 비밀번호가 메일로 전송되었습니다.",
                });
            }
        }
    } catch (err) {
        res.status(400).json({
            fail: "다시 입력해주세요.",
        });
    }
};
