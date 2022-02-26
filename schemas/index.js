const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
    mongoose
        .connect(process.env.MONGO_DB_CONNECT, {
            ignoreUndefined: true,
        })
        .catch((err) => console.log(err));
};
module.exports = connect;
