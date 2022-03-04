const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const connect = require("./schemas/index");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
const helmet = require("helmet");
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
app.use(cors());
app.use(helmet());

app.use("/api", [userRouter, guideRouter, profileRouter, mapRouter, emailRouter]);

// app.listen(port, () => {
//     console.log(port, "포트로 서버가 켜졌습니다.");
// });
