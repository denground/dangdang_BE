const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
require('dotenv').config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization === undefined) {
        res.status(400).json({ errorMessage: '로그인 후 사용하시오' });
        return;
    }

    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType != 'Bearer') {
        res.status(401).json({
            errorMessage: '로그인 후 사용하시오',
        });
        return;
    }

    try {
        const { userID } = jwt.verify(
            tokenValue,
            `${process.env.TOKEN_SECRET_KEY}`
        );

        User.findOne({ userID })
            .exec()
            .then((user) => {
                res.locals.user = user;

                next();
            });
    } catch (error) {
        //jwt 토큰이 유효하지 않은 경우
        return res.status(401).json({
            user: null,
            errorMessage: '로그인 후 사용하시오',
        });
    }
};
