const express = require('express');
const connect = require('./schemas/index');
const cors = require('cors');
const app = express();
const helmet = require('helmet')
const port = process.env.PORT;
const userRouter = require('./routes/user');
const guideRouter = require('./routes/guide');
const profileRouter = require('./routes/profile');
const mapRouter = require('./routes/map');
const emailRouter = require('./routes/email');

require('dotenv').config();

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

connect();

app.use(cors({ 
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(helmet());

app.use('/api', [userRouter, guideRouter, profileRouter, mapRouter, emailRouter]);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(port, () => {
  console.log(port, '포트로 서버가 켜졌습니다.');
});
