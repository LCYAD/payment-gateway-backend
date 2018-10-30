const bunyan = require('bunyan');

const logs = bunyan.createLogger({ name: 'console-logs' });

class ConsoleLogger {
    static log(level, message, body) {
        const content = `${message}: ${body}`;
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
