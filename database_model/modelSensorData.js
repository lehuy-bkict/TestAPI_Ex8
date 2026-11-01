'use strict';

const { Schema, model } = require('mongoose');
const { getNextSequenceValue } = require('./modelCounter');

const SensorDataSchema = new Schema({
    Id: {
        type: Number,
        unique: true
    },
    SensorName: {
        type: String,
        required: [true, 'SensorName is required'],
        trim: true
    },
    SensorValue: {
        type: Number,
        required: [true, 'SensorValue is required']
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },
    updatedAt: {
        type: Date,
        default: () => new Date()
    }
}, {
    versionKey: false,
    collection: 'SensorDatas',
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.createdAt;
            delete ret.updatedAt;
            return {
                Id: ret.Id,
                SensorName: ret.SensorName,
                SensorValue: ret.SensorValue
            };
        }
    }
});

SensorDataSchema.pre('save', async function (next) {
    if (this.isNew && (this.Id === undefined || this.Id === null)) {
        this.Id = await getNextSequenceValue('sensorDataId');
    }
    this.updatedAt = new Date();
    next();
});

module.exports = {
    SensorDataModel: model('SensorDatas', SensorDataSchema)
};
