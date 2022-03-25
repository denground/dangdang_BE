const User = require("../schemas/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passport = require('passport');
require("dotenv").config();

exports.userSignup = async (req, res) => {
    try {
        // Joi
        const userSchema = Joi.object({
            userID: Joi.string()
                .pattern(/^[A-Za-z\d]{2,10}$/)
                .required(),
            email: Joi.string().email().required(),
            nickname: Joi.string().pattern(/^[A-Za-z가-힣\d]{2,10}$/),
            password: Joi.string()
                .pattern(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*_-])[A-Za-z\d!@#$%^*_-]{8,16}$/
                )
                .required(),
            confirmPassword: Joi.ref("password"),
        });

        // 형식확인
        const { userID, email, nickname, password, confirmPassword } =
            await userSchema.validateAsync(req.body);

        if (password !== confirmPassword) {
            return res.status(400).json({
                fail: "비밀번호가 다르게 입력됐습니다.",
            });
        }

        // 아이디가 있는지 조회
        const checkUserID = await User.findOne({
            userID,
        });

        // 메일 조회
        const checkUserEmail = await User.findOne({
            email,
        });

        // 동일한 메일이 있는지 조회
        if (checkUserEmail) {
            return res.status(400).json({
                fail: "이미 가입한 이메일입니다.",
            });
        }

        // 아이디가 있는 경우
        if (checkUserID) {
            return res.status(400).json({
                fail: "이미 있는 아이디입니다.",
            });
        }

        // 회원가입 가능한 아이디인 경우 password 암호화
        const privateKey = process.env.PRIVATE_KEY;
        // AES 알고리즘 암호화
        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(password),
            privateKey
        ).toString();

        // 회원가입 가능할 때
        await User.create({
            userID: userID,
            email: email,
            nickname: nickname,
            // password 암호화된 비밀번호 입력
            password: encrypted,
            provider: "local",
        });

        res.status(200).json({
            success: "회원가입이 완료되었습니다🐶",
        });
    } catch (error) {
        let joiError = error.details[0].message;
        if (joiError.includes("email")) {
            res.status(400).json({
                fail: "이메일 형식을 확인해주세요.",
            });
        }
        if (joiError.includes("password")) {
            res.status(400).json({
                fail: "비밀번호는 최소 8자 이상, 16자 이하의 영어 대소문자 및 숫자, 특수문자(!@#$%^*_-)를 포함해야 합니다.",
            });
        }
        if (joiError.includes("userID")) {
            res.status(400).json({
                fail: "아이디는 2자 이상, 10자 이하의 영어 대소문자입니다.",
            });
        }
        if (joiError.includes("nickname")) {
            res.status(400).json({
                fail: "닉네임은 2자 이상, 10자 이하의 영어 대소문자나 한글입니다.",
            });
        }
    }
};

// 로그인
exports.login = async (req, res) => {
    try {
        const { userID, password } = req.body;

        // AES 알고리즘 비밀키
        const privateKey = process.env.PRIVATE_KEY;
        // 아이디 조회
        const checkUser = await User.findOne({
            userID: userID,
        });
        if (checkUser === null) {
            return res.status(400).json({
                fail: "입력창을 다시 확인하세요.",
            });
        }

        // 비밀번호 조회, AES 알고리즘 복호화
        const bytes = CryptoJS.AES.decrypt(checkUser.password, privateKey);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (password !== decrypted) {
            return res.status(400).json({
                fail: "비밀번호를 다시 확인해주세요.",
            });
        }

        // 토큰발급
        const token = jwt.sign(
            {
                userID: checkUser.userID,
                nickname: checkUser.nickname,
                provider: checkUser.provider,
            },
            process.env.TOKEN_SECRET_KEY
        );

        res.status(200).json({
            token,
            success: `${checkUser.nickname}님 환영합니다!🐶`,
        });
    } catch (err) {
        res.status(400).json({
            fail: "입력창을 확인 해주세요.",
        });
    }
};

exports.kakaoLogin = (req, res, next) => {
    passport.authenticate(
        "kakao",
        {
            failureRedirect: "/",
        },
        (err, user, info) => {
            if (err) return res.status(401).json(err);
            const { userID, nickname } = user;
            const token = jwt.sign(
                { userID: userID, nickname: nickname },
                process.env.TOKEN_SECRET_KEY
            );
            res.json({ token, success: "카카오 로그인 성공!" });
        }
    )(req, res, next);
};

// 닉네임 변경
exports.modifyNicname = async (req, res, next) => {
    try {
        const userSchema = Joi.object({
            nickname: Joi.string().pattern(/^[A-Za-z가-힣\d]{2,10}$/),
        });
        const { user } = res.locals;
        const { nickname } = await userSchema.validateAsync(req.body);

        await User.updateOne(
            { userID: user.userID },
            { $set: { nickname: nickname } }
        );

        res.status(200).json({
            success: "정보가 수정되었습니다.",
        });
    } catch (error) {
        res.status(400).json({
            fail: "닉네임은 2자 이상, 10자 이하만 가능합니다.",
        });
        next(error);
    }
};

// 비밀번호 변경
exports.modifyPassword = async (req, res, next) => {
    try {
        // Joi
        const userSchema = Joi.object({
            newPassword: Joi.string()
                .pattern(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*_-])[A-Za-z\d!@#$%^*_-]{8,16}$/
                )
                .required(),
            confirmNewPassword: Joi.ref("newPassword"),
        });
        const { user } = res.locals;
        const { password } = req.body;
        const newPassword = await userSchema.validateAsync(req.body.newPassword);
        const confirmNewPassword = await userSchema.validateAsync(req.body.confirmNewPassword);
        console.log("newPassword : ", newPassword);
        console.log("confirmNewPassword : ", confirmNewPassword);

        // AES 알고리즘 복호화
        const decryptedpassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PRIVATE_KEY
        );
        const parseDecryptedPassword = JSON.parse(
            decryptedpassword.toString(CryptoJS.enc.Utf8)
        );

        if (parseDecryptedPassword !== password) {
            res.status(400).json({
                fail: "기존 비밀번호가 잘못 입력되었습니다.",
            });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            res.status(400).json({ fail: "비밀번호가 다르게 입력됐습니다." });
            return;
        }

        const encryptedNewpassword = CryptoJS.AES.encrypt(
            JSON.stringify(newPassword),
            process.env.PRIVATE_KEY
        ).toString();

        await User.updateOne(
            { userID: user.userID },
            { $set: { password: encryptedNewpassword } }
        );

        res.status(200).json({
            success: "정보가 수정되었습니다.",
        });
    } catch (error) {
        let joiError = error.details[0].message;
        if (joiError.includes("password")) {
            res.status(400).json({
                fail: "비밀번호는 최소 8자 이상, 16자 이하의 영어 대소문자 및 숫자, 특수문자(!@#$%^*_-)를 포함해야 합니다.",
            });
            next(error);
        }
    }
};

exports.auth = async (req, res) => {
    const { user } = res.locals;
    res.json({
        userID: user.userID,
        nickname: user.nickname,
        email: user.email,
    });
};
