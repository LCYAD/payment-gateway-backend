const _ = require('lodash');
const {
    RedisClient, ResponseHandler, ConsoleLogger, RedisLogger
} = require('../shared/loader');

const Transaction = require('../models/implementation/transaction');

class SpawnTask {
    constructor() {
        this.queue = 'task_queue';
        this.redis_client = new RedisClient();
    }

    async processReq(body, res, gateway) {
        try {
            const task_info = await this.createTempRecord(body, res, gateway);
            const id = task_info[0] || null;
            const task = task_info[1] || null;
            if (id && task) {
                await this.sendTask(res, task);
                ResponseHandler.response(res, 200, id);
            } else {
                RedisLogger.log('error', 'Could not push to Redis Queue', 'no id or task at after writing to DB');
                ResponseHandler.response(res, 500, 'Could not process request');
            }
        } catch (err) {
            RedisLogger.log('error', 'Could not push to Redis Queue', err);
            ResponseHandler.response(res, 500, err);
        }
    }

    async createTempRecord(body, res, gateway) {
        try {
            const temp_payload = SpawnTask.createTempPayload(body);
            const newTransaction = new Transaction(temp_payload);
            const db_result = await Transaction.record(newTransaction);
            const id = _.get(db_result, '_id');
            await this.redis_client.writeCache(db_result);
            ConsoleLogger.log('info', 'Created new Transaction Record', db_result);
            return [id, SpawnTask.generateTask(body, gateway, id)];
        } catch (err) {
            ConsoleLogger.log('error', 'Error at creating Temp Record at MongoDB/Redis', err);
            RedisLogger.log('error', 'Error at creating Temp Record at MongoDB/Redis ', err);
            ResponseHandler.response(res, 500, err);
            return null;
        }
    }

    async sendTask(res, task) {
        try {
            await this.redis_client.pushQueue(this.queue, task);
            ConsoleLogger.log('info', 'Successly push task to Queue', task);
        } catch (err) {
            ConsoleLogger.log('error', 'Error at pushing task to Queue', err);
            RedisLogger.log('error', 'Error at pushing task to Queue', err);
            ResponseHandler.response(res, 500, err);
        }
    }

    static generateTask(body, gateway, id) {
        return JSON.stringify({
            id,
            body,
            gateway
        });
    }

    static createTempPayload(body) {
        return {
            status: 'Pending',
            name: _.get(body, 'order.name', ''),
            phone_num: _.get(body, 'order.phone_num', ''),
            currency: _.get(body, 'order.currency', ''),
            price: _.get(body, 'order.price', 0)
        };
    }
}

module.exports = SpawnTask;
