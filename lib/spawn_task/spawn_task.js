const Redis = require('ioredis');
const config = require('../../config')(process.env.NODE_ENV);

class SpawnTask {
    constructor() {
        this.redis_client = new Redis({
            port: config.redis.port,
            host: config.redis.host,
            password: config.redis.password
        });
    }

    processReq(req, id) {
        return new Promise((resolve, reject) => {
            const task = JSON.stringify({ id, req });
            this.redis_client.rpush('task_queue', task, (err) => {
                if (err) reject(err);
                resolve({
                    statusCode: 200,
                    message: 'Successfully spawned job',
                    id
                });
            });
        });
    }
}

module.exports = SpawnTask;
