const bunyan = require('bunyan');
const _ = require('lodash');

const logs = bunyan.createLogger({ name: 'console-logs' });

class ConsoleLogger {
    static log(level, message, body) {
        let log_body = body;
        if (_.isObject(log_body)) log_body = JSON.stringify(log_body);
        const content = `${message}: ${log_body}`;
        switch (level) {
        case 'error':
            logs.error(content);
            break;
        case 'warn':
            logs.warn(content);
            break;
        default:
            logs.info(content);
        }
    }
}

module.exports = ConsoleLogger;
