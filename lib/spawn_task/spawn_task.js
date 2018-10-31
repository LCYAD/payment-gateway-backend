const { RedisLogger, RedisClient } = require('../shared/loader');

class SpawnTask {
    constructor() {
        this.queue = 'task_queue';
        this.redis_client = new RedisClient();
    }

    async processReq(req, id, gateway) {
        const task = JSON.stringify({
            id,
            req,
            gateway
        });
        try {
            await this.redis_client.pushQueue(this.queue, task);
            return {
                statusCode: 200,
                message: 'Successfully spawned job',
                id
            };
        } catch (err) {
            this.redis_client.log('error', 'Could not push to Redis Queue', err);
            return {
                statusCode: 500,
                message: 'Server Internal Error',
                err
            };
        }
    }
}

module.exports = SpawnTask;
