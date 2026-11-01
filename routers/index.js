'use strict';

const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IoT Web API - Exercise 8',
            version: '1.0.0',
            description: 'RESTful Web API for SensorData and User management using NodeJS and MongoDB',
            contact: {
                name: 'IoT Lab - HUST'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local Development Server'
            }
        ]
    },
    apis: [
        path.resolve(__dirname, '../v1/routers/*.js').replace(/\\/g, '/')
    ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI Documentation endpoints
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Ping health check
router.get('/ping', (req, res) => {
    return res.status(200).json({ status: 'ok', message: 'IoT Web API is running' });
});

// Mount Resource APIs matching the exact routes in requirement
router.use('/api/SensorDatas', require('../v1/routers/sensorData.router'));
router.use('/api/Users', require('../v1/routers/user.router'));

module.exports = router;
