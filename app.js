const express = require('express');
const connect = require('./schemas/index');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const helmet = require('helmet');
const userRouter = require('./routes/user');
const guideRouter = require('./routes/guide');
const profileRouter = require('./routes/profile');
const mapRouter = require('./routes/map');
require('dotenv').config();

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
  app.use(helmet());
  
  app.use('/api', [userRouter, guideRouter, profileRouter, mapRouter]);
  
  app.listen(port, () => {
  console.log(port, '포트로 서버가 켜졌습니다.');
});
