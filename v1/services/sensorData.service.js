'use strict';

const { SensorDataModel } = require('../../database_model/modelSensorData');

class SensorDataService {
    static async getAll() {
        return await SensorDataModel.find().sort({ Id: 1 });
    }

    static async getById(id) {
        const numId = Number(id);
        if (isNaN(numId)) return null;
        return await SensorDataModel.findOne({ Id: numId });
    }

    static async create(payload) {
        const { SensorName, SensorValue } = payload;
        const newRecord = new SensorDataModel({
            SensorName,
            SensorValue: Number(SensorValue)
        });
        return await newRecord.save();
    }

    static async update(id, payload) {
        const numId = Number(id);
        if (isNaN(numId)) return null;

        const updateData = { updatedAt: new Date() };
        if (payload.SensorName !== undefined) updateData.SensorName = payload.SensorName;
        if (payload.SensorValue !== undefined) updateData.SensorValue = Number(payload.SensorValue);

        return await SensorDataModel.findOneAndUpdate(
            { Id: numId },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    }

    static async delete(id) {
        const numId = Number(id);
        if (isNaN(numId)) return null;
        return await SensorDataModel.findOneAndDelete({ Id: numId });
    }
}

module.exports = SensorDataService;
