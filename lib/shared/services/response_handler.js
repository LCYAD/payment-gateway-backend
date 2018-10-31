/* eslint-disable camelcase */

const _ = require('lodash');

class ResponseHandler {
    static response(res, status, payload) {
        const res_status = status || 500;
        const res_payload = payload || '';
        const res_msg = {
            meta: res_status || 500,
            message: ResponseHandler.getMessage(res_status),
            res_payload
        };
        res.status(res_status).send(res_msg);
    }

    static getMessage(status) {
        const responses = {
            200: 'Success',
            400: 'Bad Request',
            404: 'Not Found',
            500: 'Internal Error'
        };
        return _.get(responses, status);
    }
}

module.exports = ResponseHandler;
