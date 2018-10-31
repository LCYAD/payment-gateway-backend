const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const HTTP = require('http');

// get config
const config = require('../config')(process.env.NODE_ENV);

// routes instance
const routes = require('../routes');

// import shared resources
const { ConsoleLogger, ResponseHandler } = require('../lib/shared/loader');

// declare express app
const app = express();
const http = HTTP.Server(app);

// middleware setting
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);

// Routing
app.use('/api/payment', new routes.PaymentRoute().router());
app.use('/api/getID', new routes.QueryRoute().router());

// Use Response Handler for unknown routes
app.use((req, res) => {
    ResponseHandler.response(res, 404, 'Links could not be found');
});

ConsoleLogger.log('info', 'Server started at 8080', '');
http.listen(config.express.port);

module.exports = app;
