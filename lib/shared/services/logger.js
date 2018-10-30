const bunyan = require('bunyan');

class Logger {
    constructor() {
        this.logs = bunyan.createLogger({ name: 'logs' });
    }

    static consoleLogger(level, message, body) {
        switch (level) {
        case 'error':
            this.logs.error(`${message}:  ${body}`);
            break;
        case 'warn':
            this.logs.warn(`${message}:  ${body}`);
            break;
        default:
            this.logs.info(`${message}:  ${body}`);
        }
    }
}

module.exports = Logger;
