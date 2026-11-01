'use strict';

const SensorDataService = require('../services/sensorData.service');

class SensorDataController {
    static async getAll(req, res, next) {
        try {
            const data = await SensorDataService.getAll();
            return res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const item = await SensorDataService.getById(id);
            if (!item) {
                return res.status(404).json({
                    message: `SensorData with Id=${id} not found`
                });
            }
            return res.status(200).json(item);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const { SensorName, SensorValue } = req.body;
            if (!SensorName || SensorValue === undefined || SensorValue === null) {
                return res.status(400).json({
                    message: 'SensorName and SensorValue are required'
                });
            }
            const newItem = await SensorDataService.create(req.body);
            return res.status(201).json(newItem);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await SensorDataService.update(id, req.body);
            if (!updated) {
                return res.status(404).json({
                    message: `SensorData with Id=${id} not found`
                });
            }
            return res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await SensorDataService.delete(id);
            if (!deleted) {
                return res.status(404).json({
                    message: `SensorData with Id=${id} not found`
                });
            }
            return res.status(200).json(deleted);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SensorDataController;
