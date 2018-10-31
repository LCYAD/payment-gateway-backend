const _ = require('lodash');
const { ConsoleLogger, RedisLogger, RedisClient } = require('../shared/loader');
const GatewayManager = require('../payment_gateway');

class ServiceWorker {
    constructor() {
        this.queue = 'task_queue';
        this.redis_client = new RedisClient();
        ConsoleLogger.log('info', 'Service Worker Started', '');
    }

    async handleTask() {
        try {
            const task = await this.redis_client.popQueue(this.queue);
            if (!task) this.handleTask();
            const json_task = JSON.parse(task[1]);
            const id = _.get(json_task, 'id');
            const order = _.get(json_task, 'req.order');
            const credit_card = _.get(json_task, 'req.credit_card');
            const gateway = _.get(json_task, 'gateway');
            const result = await GatewayManager[gateway].call(id, order, credit_card);
            const meta_status = _.get(result, 'meta');
            if (meta_status === 200) {
                _.set(result, 'order', order);
                _.set(result, 'id', id);
                await this.redis_client.writeCache(result);
                ConsoleLogger.log('info', 'Process succesful', '');
                RedisLogger.log('info', 'Written result to cache', result);
            } else {
                ConsoleLogger.log('error', 'Processed failed', result);
            }
            this.handleTask();
        } catch (err) {
            ConsoleLogger.log('error', 'Error at popping or process queue task', err);
        }
    }
}

const serviceworker = new ServiceWorker();
serviceworker.handleTask();
