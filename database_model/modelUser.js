'use strict';

const { Schema, model } = require('mongoose');
const { getNextSequenceValue } = require('./modelCounter');

const UserSchema = new Schema({
    Id: {
        type: Number,
        unique: true
    },
    UserName: {
        type: String,
        required: [true, 'UserName is required'],
        trim: true
    },
    Password: {
        type: String,
        required: [true, 'Password is required']
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
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
    collection: 'Users',
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.createdAt;
            delete ret.updatedAt;
            return {
                Id: ret.Id,
                UserName: ret.UserName,
                Password: ret.Password,
                Email: ret.Email
            };
        }
    }
});

UserSchema.pre('save', async function (next) {
    if (this.isNew && (this.Id === undefined || this.Id === null)) {
        this.Id = await getNextSequenceValue('userId');
    }
    this.updatedAt = new Date();
    next();
});

module.exports = {
    UserModel: model('Users', UserSchema)
};
