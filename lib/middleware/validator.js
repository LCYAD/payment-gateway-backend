const _ = require('lodash');
const { ResponseHandler } = require('../shared/loader');

class Validator {
    static validate(req, res, next) {
        const payload = _.get(req, 'body');
        if (payload === {}) {
            ResponseHandler.response(res, 400, null);
        }
        next();
    }
}

module.exports = Validator;
