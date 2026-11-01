'use strict';

require('dotenv').config();
const { server } = require('./app');

const port = Number(process.env.SERVER_PORT || 5000);

server.once('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`[Bootstrap] Port ${port} is already in use. Stop the existing process or change SERVER_PORT in .env.`);
    } else {
        console.error('[Bootstrap] HTTP server error:', error.message);
    }
    process.exitCode = 1;
});

server.listen(port, () => {
    console.log(`=======================================================`);
    console.log(` IoT Web API Server (Exercise 8) is running!`);
    console.log(` Base URL:    http://localhost:${port}`);
    console.log(` Swagger UI:  http://localhost:${port}/swagger`);
    console.log(`=======================================================`);
});
