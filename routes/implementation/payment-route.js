const express = require('express');

class PaymentRoute {
    route() {
        const router = express.Router();
        router.post('/amex/', this.amex.bind(this));
        router.post('/other/', this.other.bind(this));
        return router;
    }

    static amex(req, res) {
        res.sendStatus(200);
    }

    static other(req, res) {
        res.sendStatus(200);
    }
}

module.exports = PaymentRoute;
