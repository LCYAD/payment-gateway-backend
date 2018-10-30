const RedisLogger = require('../shared/loader')('RedisLogger');
const RedisClient = require('../shared/loader')('RedisClient');

class SpawnTask {
    constructor() {
        this.queue = 'task_queue';
    }

    async processReq(req, id) {
        const task = JSON.stringify({ id, req });
        try {
            await RedisClient.pushQueue(this.queue, task);
            return {
                statusCode: 200,
                message: 'Successfully spawned job',
                id
            };
        } catch (err) {
            RedisLogger.log('error', 'Could not push to Redis Queue', err);
            return err;
        }
    }
}

module.exports = SpawnTask;
