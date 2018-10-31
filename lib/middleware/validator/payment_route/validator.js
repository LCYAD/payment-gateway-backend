const _ = require('lodash');
const { ResponseHandler } = require('../../../shared/loader');

const required_fields = [
    'order.name',
    'order.phone_num',
    'order.currency',
    'order.price',
    'credit_card.type',
    'credit_card.card_number',
    'credit_card.ccv',
    'credit_card.holder_name'
];

class Validator {
    static validate(req, res, next) {
        const route_path = _.get(req, 'route.path', null);
        const payload = _.get(req, 'body');
        let result;
        switch (route_path) {
        case '/A':
            result = Validator.checkPayloadA(payload);
            break;
        case '/B':
            result = Validator.checkPayloadB(payload);
            break;
        default:
            ResponseHandler.response(res, 404, 'Path Not Found');
        }
        if (!result.validity) {
            ResponseHandler.response(res, 400, `Bad Input Format.  ${result.message}`);
        } else {
            next();
        }
    }

    static checkPayloadA(payload) {
        const allowed_currency_other = ['USD', 'AUD', 'EUR', 'JPY', 'CNY'];
        const allowed_cards_amex = ['amex'];
        const allowed_cards_other = ['visa', 'master', 'discover', 'other'];
        const result = Validator.mapField(payload, required_fields);
        if (!result.validity) return result;
        if (allowed_cards_amex.indexOf(_.get(payload, 'credit_card.type')) === -1
            && allowed_cards_other.indexOf(_.get(payload, 'credit_card.type')) === -1) {
            _.set(result, 'validity', false);
            _.set(result, 'message', 'Invalid Card Type. Options are amex, visa, master, discover, other');
        } else if (allowed_cards_other.indexOf(_.get(payload, 'credit_card.type')) !== -1
            && allowed_currency_other.indexOf(_.get(payload, 'order.currency')) === -1) {
            _.set(result, 'validity', false);
            _.set(result, 'message', 'Invalid Card Type or Currency.  Only Amex Card (for all currency) or Other Card (except HKD) are allowed');
        }
        if (!Validator.checkCreditCardLength(_.get(payload, 'credit_card.card_number'))) {
            _.set(result, 'validity', false);
            _.set(result, 'message', 'Invalid credit card format');
        }
        return result;
    }

    static checkPayloadB(payload) {
        const result = Validator.mapField(payload, required_fields);
        const allowed_currency = ['HKD'];
        const allowed_cards = ['visa', 'master', 'discover', 'other'];
        if (!result.validity) return result;
        if (allowed_cards.indexOf(_.get(payload, 'credit_card.type')) === -1
            || allowed_currency.indexOf(_.get(payload, 'order.currency')) === -1) {
            _.set(result, 'validity', false);
            _.set(result, 'message', 'Invalid Card Type or Currency.  Only Non-Amex Card and HKD are allowed');
        }
        return result;
    }

    static mapField(payload) {
        let check_field;
        let validity = true;
        const invalid_fields = [];
        for (const field of required_fields) {
            check_field = _.get(payload, field, null);
            if (!check_field) {
                validity = false;
                invalid_fields.push(field);
            }
        }
        return {
            validity,
            message: `Missing: ${invalid_fields.join(', ')}`
        };
    }

    static checkCreditCardLength(cc_num) {
        // clean the credit card number first
        const cleaned_cc_num = cc_num.replace(/\D/g, '');
        return cleaned_cc_num.length === 16;
    }
}

module.exports = Validator;
