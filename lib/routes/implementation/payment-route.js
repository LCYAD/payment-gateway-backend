const express = require('express');
const SpawnTask = require('../../spawn_task/spawn_task');
const Validators = require('../../middleware/validator');

class PaymentRoute {
    constructor() {
        this.spawn_task_handler = new SpawnTask();
    }

    router() {
        const router = express.Router();
        router.post('/A', Validators.PaymentRouteValidator.validate, this.gatewayA.bind(this));
        router.post('/B', Validators.PaymentRouteValidator.validate, this.gatewayB.bind(this));
        return router;
    }

    async gatewayA(req, res) {
        this.spawn_task_handler.processReq(req.body, res, 'mock');
    }

    async gatewayB(req, res) {
        this.spawn_task_handler.processReq(req.body, res, 'mock');
    }
}

module.exports = PaymentRoute;
