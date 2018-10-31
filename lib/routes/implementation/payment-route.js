const express = require('express');
const uuid = require('uuid/v4');
const SpawnTask = require('../../spawn_task/spawn_task');
const { ConsoleLogger, RedisLogger } = require('../../shared/loader');
const Validators = require('../../middleware/validator');

class PaymentRoute {
    constructor() {
        this.spawn_task_handler = new SpawnTask();
    }

    router() {
        const router = express.Router();
        router.post('/A', Validators.PaymentValidator.validate, this.gatewayA.bind(this));
        router.post('/B', Validators.PaymentValidator.validate, this.gatewayB.bind(this));
        return router;
    }

    async gatewayA(req, res) {
        const id = uuid();
        let response;
        try {
            response = await this.spawn_task_handler.processReq(req.body, id, 'mock');
        } catch (e) {
            ConsoleLogger.log('error', 'Error at Spawn Task Process', e);
            RedisLogger.log('error', 'Error at Spawn Task Process', e);
        }
        res.json(response);
    }

    async gatewayB(req, res) {
        const id = uuid();
        let response;
        try {
            response = await this.spawn_task_handler.processReq(req.body, id, 'mock');
        } catch (e) {
            ConsoleLogger.log('error', 'Error at Spawn Task Process', e);
            RedisLogger.log('error', 'Error at Spawn Task Process', e);
        }
        res.json(response);
    }
}

module.exports = PaymentRoute;