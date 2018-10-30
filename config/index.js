require('dotenv').config({ path: `${__dirname}/.env` });

const development = {
    express: {
        port: '8080'
    },
    redis: {
        host: process.env.REDIS_HOST_DEV,
        port: process.env.REDIS_PORT_DEV
    }
};

const production = {
    express: {
        port: '8080'
    },
    redis: {
        host: process.env.REDIS_HOST_PRO,
        port: process.env.REDIS_PORT_PRO
    }
};

const config = Object.freeze({
    development,
    production
});

module.exports = (environment) => {
    return config[environment] || config.development;
};
