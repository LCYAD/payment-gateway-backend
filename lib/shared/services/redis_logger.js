const bunyan = require('bunyan');
const _ = require('lodash');
const RedisStream = require('bunyan-redis-stream');
const RedisClient = require('./redis_client');

const client = RedisClient.returnClient();

const stream = new RedisStream({
    client,
    key: 'redis_logs',
    type: 'list'
});

const logger = bunyan.createLogger({
    name: 'redis_logs',
    streams: [{
        type: 'raw',
        level: 'trace',
        stream
    }]
});

class RedisLogger {
    static log(level, message, body) {
        let log_body = body;
        if (_.isObject(log_body)) log_body = JSON.stringify(log_body);
        const content = `${message}: ${log_body}`;
        switch (level) {
        case 'error':
            logger.error(content);
            break;
        case 'warn':
            logger.warn(content);
            break;
        default:
            logger.info(content);
        }
    }
}

module.exports = RedisLogger;
