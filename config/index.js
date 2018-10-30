require('dotenv').config();

module.exports = Object.freeze({
    express: {
        port: '8080'
    },
    redis: {
        host: '127.0.0.1',
        port: '6379'
    }
});
