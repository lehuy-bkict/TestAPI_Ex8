'use strict';

const express = require('express');
const router = express.Router();
const SensorDataController = require('../controllers/sensorData.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     SensorData:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *           description: The auto-generated id of the sensor data
 *           example: 1
 *         SensorName:
 *           type: string
 *           description: Name or type of sensor
 *           example: "DHT22_Temperature"
 *         SensorValue:
 *           type: number
 *           format: float
 *           description: Current recorded value of the sensor
 *           example: 28.5
 *     SensorDataInput:
 *       type: object
 *       required:
 *         - SensorName
 *         - SensorValue
 *       properties:
 *         SensorName:
 *           type: string
 *           example: "DHT22_Temperature"
 *         SensorValue:
 *           type: number
 *           format: float
 *           example: 28.5
 */

/**
 * @swagger
 * tags:
 *   name: SensorDatas
 *   description: Sensor data management Web API
 */

/**
 * @swagger
 * /api/SensorDatas:
 *   get:
 *     summary: Retrieve a list of all sensor data
 *     tags: [SensorDatas]
 *     responses:
 *       200:
 *         description: A list of sensor data records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorData'
 *   post:
 *     summary: Create a new sensor data record
 *     tags: [SensorDatas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorDataInput'
 *     responses:
 *       201:
 *         description: Sensor data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       400:
 *         description: Invalid input parameters
 */
router.route('/')
    .get(SensorDataController.getAll)
    .post(SensorDataController.create);

/**
 * @swagger
 * /api/SensorDatas/{id}:
 *   get:
 *     summary: Get a sensor data record by Id
 *     tags: [SensorDatas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sensor data Id
 *     responses:
 *       200:
 *         description: Sensor data found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: Sensor data not found
 *   put:
 *     summary: Update an existing sensor data record by Id
 *     tags: [SensorDatas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sensor data Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorDataInput'
 *     responses:
 *       200:
 *         description: Sensor data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: Sensor data not found
 *   delete:
 *     summary: Delete a sensor data record by Id
 *     tags: [SensorDatas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sensor data Id
 *     responses:
 *       200:
 *         description: Sensor data deleted successfully
 *       404:
 *         description: Sensor data not found
 */
router.route('/:id')
    .get(SensorDataController.getById)
    .put(SensorDataController.update)
    .delete(SensorDataController.delete);

module.exports = router;
