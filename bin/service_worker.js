const _ = require('lodash');
const mongoose = require('mongoose');
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
            ConsoleLogger.log('info', 'Received task. Processing.....', '');
            const json_task = JSON.parse(task[1]);
            const uuid = _.get(json_task, 'id');
            const order = _.get(json_task, 'req.order');
            const credit_card = _.get(json_task, 'req.credit_card');
            const gateway = _.get(json_task, 'gateway');
            ConsoleLogger.log('info', 'Processed Data.  Call Gateway Service', `${gateway} ${uuid}: ${JSON.stringify(order)} ${JSON.stringify(credit_card)}`);
            const result = await GatewayManager[gateway].call(uuid, order, credit_card);
            const meta_status = _.get(result, 'meta');
            RedisLogger.log('info', 'Gateway called', result);
            if (meta_status === 200) {
                const res_payload = ServiceWorker.createPayload(uuid, order, 'Success');
                await this.redis_client.writeCache(res_payload);
                const newTransaction = new Transaction(res_payload);
                await Transaction.record(newTransaction);
                ConsoleLogger.log('info', 'Process succesful', '');
                RedisLogger.log('info', 'Process Successfully Presist in Local', res_payload);
            } else {
                ConsoleLogger.log('error', 'Processed failed', result);
            }
            this.handleTask();
        } catch (err) {
            ConsoleLogger.log('error', 'Error at popping or process queue task', err);
            RedisLogger.log('error', 'Error at popping or process queue task', err);
        }
    }

    static createPayload(uuid, order, status) {
        return {
            uuid,
            status,
            name: order.name,
            phone_num: order.phone_num,
            currency: order.currency,
            price: order.price
        };
    }
}

const serviceworker = new ServiceWorker();
serviceworker.handleTask();
