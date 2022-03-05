const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const connect = require("./schemas/index");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
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

http.createServer(app).listen(4200);
https.createServer(options, app).listen(443, () => {
    console.log(port, "포트로 서버가 켜졌습니다.");
});

connect();

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
// https로 접속했을 때 http로 가지 않게 하기 위해 약 1년간 https로 묶어둔다.
app.use(helmet.hsts({
    maxAge: ms("1 year"),
    includeSubDomains: true
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
