const nodemailer = require('nodemailer');
const User = require('../schemas/user');
const CryptoJS = require('crypto-js');
require('dotenv').config();

exports.sendEmail = async (req, res, next) => {
    try {
        const { userID, email } = req.body;

        // 이메일 입력없으면 400메세지
        if (!email)
            return res.status(400).json({
                fail: '이메일을 입력해주세요.',
            });

        // 메일을 보내는 gmail 계정
        const EMAIL = process.env.EMAIL;
        const EMAIL_PASSWORD = process.env.PASSWORD;

        // 유저를 불러온다.
        const user = await User.findOne({
            email,
        });
        console.log('기존 password', user.password);

        // 이메일 수신자 (ID 찾는 유저)
        let receiverEmail = user.email;

        // 보낼 내용
        let mailOptions = ``;

        // 아이디 입력이 없는 경우
        if (!userID) {
            // 전송할 email 내용 작성
            mailOptions = {
                from: EMAIL,
                to: receiverEmail,
                subject: '찾으시는 ID 입니다.',
                text: `<h1>회원님의 아이디는 ${user.userID} 입니다.</h1>`,
            };
        }

        // 아이디 입력이 있는 경우
        if (userID) {
            // password 찾기
            if (user.userID !== userID) {
                return res.status(400).json({
                    fail: '가입한 아이디 이메일을 입력해주세요.',
                });
            } else {
                // 임시 비밀번호 생성
                let arr =
                    '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,!,@,#,$,%,^,*,_,-'.split(
                        ','
                    );
                let randomPw = createCode(arr, 12);
                console.log(randomPw);

                function createCode(objArr, iLength) {
                    let arr = objArr;
                    let randomStr = '';
                    for (let i = 0; i < iLength; i++) {
                        randomStr +=
                            arr[Math.floor(Math.random() * arr.length)];
                    }
                    return randomStr;
                }

                // password 암호화
                randomPw = process.env.PRIVATE_KEY;
                console.log('randomPw 암호화', randomPw);
                // AES 알고리즘 암호화
                const encrypted = CryptoJS.AES.encrypt(
                    JSON.stringify(password),
                    privateKey
                ).toString();
                console.log('encryted 암호화', encrypted);

                await User.updateOne(
                    { userID: user.userID },
                    { $set: { password: encrypted } }
                );

                console.log('password 업데이트 됐을까?', user.password);

                // Password 복호화
                const bytes = CryptoJS.AES.decrypt(
                    user.password,
                    process.env.PRIVATE_KEY
                );
                const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                // 전송할 email 내용 작성
                mailOptions = {
                    from: EMAIL,
                    to: receiverEmail,
                    subject: '찾으시는 PASSWORD 입니다..',
                    text: `<h1>${user.userID}님의 비밀번호는 ${decrypted} 입니다.</h1>`,
                };
            }
        }

        // transport 생성
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD,
            },
        });

        // email 전송
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('send mail success');
        });

        res.status(200).json({
            success: '메일 전송완료!',
        });
    } catch (err) {
        res.status(400).json({
            fail: '다시 입력해주세요.',
        });
    }
};
