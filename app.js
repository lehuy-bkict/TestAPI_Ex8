'use strict';

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
require('dotenv').config();

// Connect MongoDB Singleton
require('./base_connects/base_mongodb/init.mongodb');

// Middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(compression());
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.json({ limit: '50mb' }));

// Redirect root to Swagger UI
app.get('/', (req, res) => {
    res.redirect('/swagger');
});

// Main router
app.use('/', require('./routers/index'));

// 404 handler
app.use((req, res, next) => {
    const error = new Error('Resource Not Found');
    error.status = 404;
    next(error);
});

// Central error handler
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    });
});

module.exports = {
    app,
    server
};
