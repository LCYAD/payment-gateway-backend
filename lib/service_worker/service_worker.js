const { ConsoleLogger, RedisLogger, RedisClient } = require('../shared/loader');

class ServiceWorker {
    constructor() {
        this.queue = 'task_queue';
    }

    async handleTask() {
        try {
            const task = await RedisClient.popQueue(this.queue);
            if (!task) this.handleTask();
            ConsoleLogger.log('info', 'Task Recieved', task);
            RedisLogger.log('info', 'Task Recieved', task);
        } catch (err) {
            ConsoleLogger.log('error', 'Error at popping redis queue', err);
        }
    }
}

const serviceworker = new ServiceWorker();
serviceworker.handleTask();
