const uuid = require('uuid/v4');
const { RedisClient, ResponseHandler, ConsoleLogger } = require('../shared/loader');

class SpawnTask {
    constructor() {
        this.queue = 'task_queue';
        this.redis_client = new RedisClient();
    }

    async processReq(req, res, gateway) {
        const id = uuid();
        const task = JSON.stringify({
            id,
            req,
            gateway
        });
        try {
            ConsoleLogger.log('info', 'Pushing Task to queue', '');
            await this.redis_client.pushQueue(this.queue, task);
            const res_payload = { id };
            ResponseHandler.response(res, 200, res_payload);
        } catch (err) {
            this.redis_client.log('error', 'Could not push to Redis Queue', err);
            ResponseHandler.response(res, 500, err);
        }
    }
}

module.exports = SpawnTask;
