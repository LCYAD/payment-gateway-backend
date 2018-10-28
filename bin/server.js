const express = require('express');
const bodyParser = require('body-parser');
// const uuid = require('uuid');
const cors = require('cors');
const HTTP = require('http');

// get config
const config = require('../config');

// routes instance
const routes = require('../routes');

// config import

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

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

http.listen(config.express.port);

module.exports = app;
