const _ = require('lodash');
const express = require('express');
const Transaction = require('../../models/implementation/transaction');
const {
    ConsoleLogger, RedisClient, ResponseHandler
} = require('../../shared/loader');
const Validators = require('../../middleware/validator');

class QueryRoute {
    constructor() {
        this.redis_client = new RedisClient();
    }

    router() {
        const router = express.Router();
        router.get('/:id', Validators.QueryRouteValidator.validate, this.queryID.bind(this));
        return router;
    }

    async queryID(req, res) {
        let result;
        let retries = 0;
        let status;
        const id = _.get(req, 'params.id');
        while (retries < 3) {
            try {
                result = await this.redis_client.getCached(`record:${id}`);
                ConsoleLogger.log('info', 'Got Cached result', result);
                status = QueryRoute.getStatus(result);
                if (status !== 'Pending') break;
                retries += 1;
                if (retries === 3) {
                    // Timeout the response
                    ConsoleLogger.log('error', 'Too many retries: Timing out', '');
                    ResponseHandler.response(res, 811, 'Too many retries');
                }
                ConsoleLogger.log('info', `Retry in ${retries} sec(s)`, '');
                await QueryRoute.timeout(retries * 1000);
            } catch (err) {
                ConsoleLogger.log('error', 'Failure at Redis getCached', err);
                ResponseHandler.response(res, 500, err);
            }
        }
        try {
            if (result) {
                result = JSON.parse(result);
                ResponseHandler.response(res, 200, result);
            } else {
                // Search the DB if cannot find the data in cached
                result = await Transaction.getRecord(id);
                ConsoleLogger.log('info', 'Retrieved transaction from DB', result);
                if (result) {
                    // write the data back to redis cache
                    await this.redis_client.writeCache(result);
                    ConsoleLogger.log('info', 'Written DB data back to Cache', result);
                    ResponseHandler.response(res, 200, result);
                }
                ResponseHandler.response(res, 801, result);
            }
        } catch (err) {
            ConsoleLogger.log('error', 'Failure at Redis getCached', err);
            ResponseHandler.response(res, 500, err);
        }
    }

    static getStatus(payload) {
        let json_payload = null;
        if (!payload) return null;
        try {
            json_payload = JSON.parse(payload);
        } catch (err) {
            ConsoleLogger.log('error', 'Failure at getStatus', err);
        }
        return _.get(json_payload, 'status');
    }

    static timeout(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

module.exports = QueryRoute;
