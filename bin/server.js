const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const HTTP = require('http');
const mongoose = require('mongoose');

// get config
const config = require('../config')(process.env.NODE_ENV);

// routes instance
const routes = require('../lib/routes');

// import shared resources
const { ConsoleLogger, ResponseHandler } = require('../lib/shared/loader');

// connect mongoose
mongoose.connect('mongodb://mongo/transaction', { useNewUrlParser: true })
    .then(() => {
        ConsoleLogger.log('info', 'MongoDB connected', '');
    })
    .catch((err) => {
        ConsoleLogger.log('error', 'Error connecting to MongoDB', err);
    });
// const db = mongoose.connection;
// db.on('error', );
// db.once('open', () => {
//     );
// });

// declare express app
const app = express();
const http = HTTP.Server(app);

// middleware setting
app.use((req, res, next) => {
    bodyParser.json()(req, res, (err) => {
        if (err) {
            ResponseHandler.response(res, 500, 'Please enter a valid JSON');
            return;
        }
        next();
    });
});
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
