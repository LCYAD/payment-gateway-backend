const ConsoleLogger = require('./services/console_logger');
const RedisLogger = require('./services/redis_logger');
const RedisClient = require('./services/redis_client');
const ResponseHandler = require('./services/response_handler');

// define loader
const SharedManager = {
    ConsoleLogger,
    RedisLogger,
    RedisClient,
    ResponseHandler
};

module.exports = SharedManager;
