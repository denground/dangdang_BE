const express = require('express');
const connect = require('./schemas/index');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const userRouter = require('./schemas/user');
const guideRouter = require('./schemas/guide');
const profileRouter = require('./schemas/profile');
const mapRouter = require('./schemas/map');
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
app.use(cors());

app.use('/api', [mapRouter, userRouter, guideRouter, profileRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 켜졌습니다.');
});
