const Redis = require('ioredis');
const config = require('../../../config')(process.env.NODE_ENV);

class RedisClient {
    constructor() {
        this.redis = new Redis({
            port: config.redis.port,
            host: config.redis.host
        });
    }

    returnClient() {
        return this.redis;
    }

    popQueue(queue) {
        return this.redis.blpop([queue, 0]);
    }

    pushQueue(queue, data) {
        return this.redis.rpush(queue, data);
    }
}

module.exports = new RedisClient();
