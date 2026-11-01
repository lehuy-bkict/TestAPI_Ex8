'use strict';

const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        const host = process.env.DATABASE_HOST || '127.0.0.1:27017';
        const query = process.env.DATABASE_QUERY || 'IoT_Ex8';
        const mongoUri = `mongodb://${host}/${query}?retryWrites=true&w=majority`;

        mongoose.connection.on('connected', () => {
            console.log(`[MongoDB] Connected successfully to mongodb://${host}/${query}`);
        });

        mongoose.connection.on('error', (err) => {
            console.error('[MongoDB] Runtime connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('[MongoDB] Disconnected. Reconnecting...');
        });

        mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        }).then(() => {
            console.log('Connected MongoDB Success');
        }).catch((err) => {
            console.error('[MongoDB] Initial connection error:', err.message);
        });

        process.on('unhandledRejection', function (err) {
            if (err && 'MongoError' === err.name) {
                console.error('unhandledRejection: ' + err.message);
                return;
            }
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports = Database.getInstance();
