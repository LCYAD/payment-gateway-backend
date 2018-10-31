const _ = require('lodash');
const { ConsoleLogger, RedisClient } = require('../shared/loader');
const GatewayManager = require('../payment_gateway');

class ServiceWorker {
    constructor() {
        this.queue = 'task_queue';
    }

    async handleTask() {
        try {
            const task = await RedisClient.popQueue(this.queue);
            if (!task) this.handleTask();
            ConsoleLogger.log('info', 'Handling Taks', task);
            const result = await GatewayManager.mock.call();
            const meta_status = _.get(result, 'meta');
            if (meta_status === 200) {
                ConsoleLogger.log('info', 'Transaction success', result);
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
