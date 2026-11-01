'use strict';

const { Schema, model } = require('mongoose');

const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
}, {
    versionKey: false,
    collection: 'Counters'
});

const CounterModel = model('Counters', CounterSchema);

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await CounterModel.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}

module.exports = {
    CounterModel,
    getNextSequenceValue
};
