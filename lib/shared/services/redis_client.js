const _ = require('lodash');
const Redis = require('ioredis');
const config = require('../../../config')(process.env.NODE_ENV);

class RedisClient {
    constructor() {
        this.redis = new Redis({
            port: config.redis.port,
            host: 'redis'
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

    getCached(key) {
        return this.redis.get(key);
    }

    writeCache(data) {
        const json_data = JSON.stringify(data);
        const id = _.get(data, 'uuid');
        const key = `record:${id}`;
        return this.redis.setex(key, 24 * 60 * 60, json_data);
    }

    writeCacheTemp(key) {
        const temp_status = { status: 'Pending' };
        return this.redis.setex(key, 60, temp_status);
    }
}

module.exports = RedisClient;
