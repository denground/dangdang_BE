const fs = require("fs");
const https = require("https");
const express = require("express");
const connect = require("./schemas/index");
const cors = require("cors");
const app = express();
const session = require('express-session')

// passport 모듈
const passport = require('passport')
const passportConfig = require('./passport')

const port = process.env.PORT;
// DDoS 공격 방어를 위한 제한 모듈
const rateLimit = require("express-rate-limit");

// helmet 미들웨어
const helmet = require("helmet");

// 사람이 쓰는 문자열을 밀리초로 변환해주는 모듈
const ms = require("ms");

const userRouter = require("./routes/user");
const guideRouter = require("./routes/guide");
const profileRouter = require("./routes/profile");
const mapRouter = require("./routes/map");
const emailRouter = require("./routes/email");
require("dotenv").config();

const options = { // letsencrypt로 받은 인증서 경로를 입력
    ca: fs.readFileSync("/etc/letsencrypt/live/dengroundserver.com/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/dengroundserver.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/dengroundserver.com/cert.pem")
};

https.createServer(options, app).listen(443, () => {
    console.log(port, "포트로 서버가 켜졌습니다.");
});

connect();
// 패스포트 연결
passportConfig();

app.use((req, res, next) => {
    console.log(
        "Request URL:",
        `[${req.method}]`,
        req.originalUrl,
        " - ",
        new Date().toLocaleString()
    );
    next();
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express사용 정보 숨기기
app.disable("x-powered-by");

// cors 정책
app.use(cors());

// express-session
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'session',
    cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
    }
}))

// passport
app.use(passport.initialize())
app.use(passport.session())

// https로 접속했을 때 http로 가지 않게 하기 위해 약 1년간 https로 묶어둔다.
app.use(helmet.hsts({
    maxAge: ms("1 year"),
    includeSubDomains: true
}));

// 1분동안 하나의 ip 주소에서 들어오는 request의 숫자를 100회로 제한
app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100
}));

// xss(교차 사이트 스크립팅) 공격 방어
app.use(helmet.xssFilter());

// 클릭재킹으로 부터 보호
app.use(helmet.frameguard("deny"));

// 브라우저에서 파일 형식의 임의 추측 금지
app.use(helmet.noSniff());

app.use("/api", [userRouter, guideRouter, profileRouter, mapRouter, emailRouter]);

// app.listen(port, () => {
//     console.log(port, "포트로 서버가 켜졌습니다.");
// });
