const Redis = require('ioredis');
const config = require('../../config')(process.env.NODE_ENV);

class ServiceWorker {
    constructor() {
        this.redis_client = new Redis({
            port: config.redis.port,
            host: config.redis.host,
            password: config.redis.password
        });
    }

    async handleTask() {
        return this.redis_client.blpop(['task_queue', 0], (err, task) => {
            if (err) console.error(err);
            if (!task) this.handleTask();
            console.log('Recieved Task');
            console.log(`Task: ${task}`);
        });
    }
}

const serviceworker = new ServiceWorker();
serviceworker.handleTask();
