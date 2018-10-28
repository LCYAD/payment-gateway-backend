const Redis = require('ioredis');

class SpawnTask {
    constructor(config) {
        this.redis_client = new Redis({
            port: config.port,
            host: config.host
        });
    }

    processReq(req, id) {
        const task = JSON.stringify({ id, req });
        this.redis_client.rpush('task_queue', task, (err) => {
            if (err) console.log(err); // to do need to log error
            return {
                statusCode: 200,
                message: 'Successfully spawned job'
            };
        });
    }
}

module.export = SpawnTask;
