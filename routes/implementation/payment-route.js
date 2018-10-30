const express = require('express');
const uuid = require('uuid/v4');
const SpawnTask = require('../../lib/spawn_task/spawn_task');

class PaymentRoute {
    constructor() {
        this.spawn_task_handler = new SpawnTask();
    }

    router() {
        const router = express.Router();
        router.post('/amex/', this.amex.bind(this));
        router.post('/other/', this.other.bind(this));
        return router;
    }

    async amex(req, res) {
        const id = uuid();
        let response;
        try {
            response = await this.spawn_task_handler.processReq(req.body, id);
        } catch (e) {
            console.log(e);
        }
        res.json(response);
    }

    async other(req, res) {
        const id = uuid();
        let response;
        try {
            response = await this.spawn_task_handler.processReq(req.body, id);
        } catch (e) {
            console.log(e);
        }
        res.json(response);
    }
}

module.exports = PaymentRoute;
