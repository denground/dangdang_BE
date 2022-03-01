const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization === undefined) {
    res.status(400).json({ errorMessage: '로그인 후 사용하시오' });
    return;
  }

  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType != 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하시오',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, process.env.PRIVATE_KEY);

    User.findOne({ userId })
      .exec()
      .then((user) => {
        res.locals.user = user;

        next();
      });
  } catch (error) {
    //jwt 토큰이 유효하지 않은 경우
    return res.status(401).send({
      user: null,
      errorMessage: '로그인 후 사용하시오',
    });
  }
};
