const _ = require('lodash');
const mongoose = require('mongoose');
const moment = require('moment');
const { ConsoleLogger, RedisLogger, RedisClient } = require('../lib/shared/loader');
const GatewayManager = require('../lib/payment_gateway');
const Transaction = require('../lib/models/implementation/transaction');

class ServiceWorker {
    constructor() {
        this.queue = 'task_queue';
        this.redis_client = new RedisClient();
        ConsoleLogger.log('info', 'Service Worker Started', '');
        // connect mongoose
        mongoose.connect('mongodb://mongo/payment', { useNewUrlParser: true })
            .then(() => {
                ConsoleLogger.log('info', 'MongoDB connected', '');
            })
            .catch((err) => {
                ConsoleLogger.log('error', 'Error connecting to MongoDB', err);
            });
    }

    async handleTask() {
        try {
            const task = await this.redis_client.popQueue(this.queue);
            if (!task) this.handleTask();
            ConsoleLogger.log('info', 'Received task. Processing.....', task);
            const json_task = JSON.parse(task[1]);
            const id = _.get(json_task, 'id');
            const order = _.get(json_task, 'body.order');
            const credit_card = _.get(json_task, 'body.credit_card');
            const gateway = _.get(json_task, 'gateway');
            ConsoleLogger.log('info', 'Processed Data.  Call Gateway Service', `${gateway} ${id}: ${JSON.stringify(order)} ${JSON.stringify(credit_card)}`);
            const result = await GatewayManager[gateway].call(id, order, credit_card);
            const meta_status = _.get(result, 'meta');
            RedisLogger.log('info', 'Gateway called', result);
            let res_payload;
            let db_result;
            if (meta_status === 200) {
                res_payload = ServiceWorker.createPayload(id, order, 'Success');
                db_result = await Transaction.updateRecord(id, res_payload);
                await this.redis_client.writeCache(db_result);
                ConsoleLogger.log('info', 'Process succesful', '');
                RedisLogger.log('info', 'Process Successfully Presist in Local', res_payload);
            } else {
                res_payload = ServiceWorker.createPayload(id, order, 'Failed');
                await this.redis_client.writeCache(res_payload);
                await Transaction.updateRecord(id, res_payload);
                ConsoleLogger.log('error', 'Processed failed at Payment Gateway', result);
            }
            this.handleTask();
        } catch (err) {
            ConsoleLogger.log('error', 'Error at popping or process queue task', err);
            RedisLogger.log('error', 'Error at popping or process queue task', err);
        }
    }

    static createPayload(id, order, status) {
        return {
            id,
            status,
            name: _.get(order, 'name', ''),
            phone_num: _.get(order, 'phone_num', ''),
            currency: _.get(order, 'currency', ''),
            price: _.get(order, 'price', 0),
            updated_at: moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        };
    }
}

const serviceworker = new ServiceWorker();
serviceworker.handleTask();
