const express = require('express');
const http = require("http");
const https = require("https");
const fs = require("fs");
const connect = require('./schemas/index');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const http_port = process.env.HTTP_PORT;
const https_port = process.env.HTTPS_PORT;
const helmet = require('helmet');
const userRouter = require('./routes/user');
const guideRouter = require('./routes/guide');
const profileRouter = require('./routes/profile');
const mapRouter = require('./routes/map');
require('dotenv').config();

const options = {
  key: fs.readFileSync('../rootca.key'),
  cert: fs.readFileSync('../rootca.crt')
}

connect();

app.use((req, res, next) => {
  console.log(
    'Request URL:',
    `[${req.method}]`,
    req.originalUrl,
    ' - ',
    new Date().toLocaleString()
    );
    next();
  });
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
  app.disable("x-powered-by");
  app.use(helmet());
  
  app.use('/api', [userRouter, guideRouter, profileRouter, mapRouter]);

  app.get('/', (req, res) => {
    res.json({ message: `Server is running on port ${req.secure ? https_port : http_port }` });
  });
  
  https.createServer(options, app).listen(443, () => {
    console.log(433, '포트로 서버가 켜졌습니다.');
  })

  // app.listen(port, () => {
  // console.log(port, '포트로 서버가 켜졌습니다.');
  // });
