const express = require('express');
const SpawnTask = require('../../lib/spawn_task/spawn_task');
const { ConsoleLogger, RedisLogger } = require('../../lib/shared/loader');

class PaymentRoute {
    constructor() {
        this.spawn_task_handler = new SpawnTask();
    }

    router() {
        const router = express.Router();
        router.post('/:id', this.queryID.bind(this));
        return router;
    }

    async queryID(req, res) {
        let response;
        // try {
        //     response = await this.spawn_task_handler.processReq(req.body, id);
        // } catch (e) {
        //     ConsoleLogger.log('error', 'Error at Spawn Task Process', e);
        //     RedisLogger.log('error', 'Error at Spawn Task Process', e);
        // }
        res.json(response);
    }
}

module.exports = PaymentRoute;
