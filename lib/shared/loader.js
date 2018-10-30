const ConsoleLogger = require('./services/console_logger');
const RedisLogger = require('./services/redis_logger');
const RedisClient = require('./services/redis_client');

// define loader
const SharedManager = {
    ConsoleLogger,
    RedisLogger,
    RedisClient
};

module.exports = (option) => {
    return SharedManager[option];
};
