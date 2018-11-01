const _ = require('lodash');
const { ResponseHandler } = require('../../../shared/loader');

class Validator {
    static validate(req, res, next) {
        const route_path = _.get(req, 'route.path', null);
        let result;
        switch (route_path) {
        case '/:id':
            result = Validator.checkID(req);
            break;
        default:
            ResponseHandler.response(res, 404, 'Path Not Found');
        }
        if (!result.validity) {
            ResponseHandler.response(res, 400, result.message);
        } else {
            next();
        }
    }

    static checkID(req) {
        const result = {
            validity: true,
            message: ''
        };
        const id = _.get(req, 'params.id');
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            _.set(result, 'validity', false);
            _.set(result, 'message', 'Invalid ID Format');
        }
        return result;
    }
}

module.exports = Validator;
