'use strict';

const http = require('http');

const BASE_URL = 'http://localhost:5000';

function request(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: parsed
                });
            });
        });

        req.on('error', err => reject(err));

        if (postData) {
            req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
        }
        req.end();
    });
}

async function runTests() {
    console.log('>>> STARTING COMPREHENSIVE WEB API TESTS (EXERCISE 8) <<<\n');
    let totalTests = 0;
    let passedTests = 0;

    function assert(name, condition, details = '') {
        totalTests++;
        if (condition) {
            passedTests++;
            console.log(`[PASS] ${name}`);
        } else {
            console.error(`[FAIL] ${name} - ${details}`);
        }
    }

    try {
        // --- Test /ping ---
        console.log('--- 1. Health check: /ping ---');
        const pingRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/ping',
            method: 'GET'
        });
        assert('GET /ping returns 200 OK', pingRes.statusCode === 200, JSON.stringify(pingRes.data));

        // --- SENSORDATA TESTS ---
        console.log('\n--- 2. SensorData API Tests ---');
        
        // POST /api/SensorDatas (item 1)
        const sensor1Payload = { SensorName: 'DHT22_Temperature', SensorValue: 27.8 };
        const postSensor1 = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/SensorDatas',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, sensor1Payload);
        assert('POST /api/SensorDatas (item 1) returns 201 Created', postSensor1.statusCode === 201);
        assert('Sensor 1 has integer Id', typeof postSensor1.data.Id === 'number');
        const sensor1Id = postSensor1.data.Id;
        console.log(`       Created Sensor 1: Id=${sensor1Id}, Name=${postSensor1.data.SensorName}, Value=${postSensor1.data.SensorValue}`);

        // POST /api/SensorDatas (item 2)
        const sensor2Payload = { SensorName: 'DHT22_Humidity', SensorValue: 65.2 };
        const postSensor2 = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/SensorDatas',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, sensor2Payload);
        assert('POST /api/SensorDatas (item 2) returns 201 Created', postSensor2.statusCode === 201);
        const sensor2Id = postSensor2.data.Id;
        console.log(`       Created Sensor 2: Id=${sensor2Id}, Name=${postSensor2.data.SensorName}, Value=${postSensor2.data.SensorValue}`);

        // GET /api/SensorDatas
        const getSensors = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/SensorDatas',
            method: 'GET'
        });
        assert('GET /api/SensorDatas returns 200 OK', getSensors.statusCode === 200);
        assert('GET /api/SensorDatas returns an array', Array.isArray(getSensors.data));
        console.log(`       Retrieved ${getSensors.data.length} sensor records.`);

        // GET /api/SensorDatas/{id}
        const getSensor1 = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/SensorDatas/${sensor1Id}`,
            method: 'GET'
        });
        assert(`GET /api/SensorDatas/${sensor1Id} returns 200 OK`, getSensor1.statusCode === 200);
        assert(`Retrieved sensor matches Id=${sensor1Id}`, getSensor1.data.Id === sensor1Id);

        // PUT /api/SensorDatas/{id}
        const updateSensorPayload = { SensorName: 'DHT22_Temperature_Updated', SensorValue: 31.5 };
        const putSensor1 = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/SensorDatas/${sensor1Id}`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }, updateSensorPayload);
        assert(`PUT /api/SensorDatas/${sensor1Id} returns 200 OK`, putSensor1.statusCode === 200);
        assert('Sensor value updated correctly to 31.5', putSensor1.data.SensorValue === 31.5);
        console.log(`       Updated Sensor 1: New Name="${putSensor1.data.SensorName}", New Value=${putSensor1.data.SensorValue}`);

        // DELETE /api/SensorDatas/{id}
        const delSensor1 = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/SensorDatas/${sensor1Id}`,
            method: 'DELETE'
        });
        assert(`DELETE /api/SensorDatas/${sensor1Id} returns 200 OK`, delSensor1.statusCode === 200);

        // GET /api/SensorDatas/{id} (verify deleted -> 404)
        const getDeletedSensor = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/SensorDatas/${sensor1Id}`,
            method: 'GET'
        });
        assert(`GET deleted sensor ${sensor1Id} returns 404 Not Found`, getDeletedSensor.statusCode === 404);

        // --- USER TESTS ---
        console.log('\n--- 3. User API Tests ---');

        // POST /api/Users (user 1)
        const user1Payload = {
            UserName: 'admin_iot',
            Password: 'Password123@',
            Email: 'admin@hust.edu.vn'
        };
        const postUser1 = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/Users',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, user1Payload);
        assert('POST /api/Users (user 1) returns 201 Created', postUser1.statusCode === 201);
        assert('User 1 has integer Id', typeof postUser1.data.Id === 'number');
        const user1Id = postUser1.data.Id;
        console.log(`       Created User 1: Id=${user1Id}, UserName="${postUser1.data.UserName}", Email="${postUser1.data.Email}"`);

        // POST /api/Users (user 2)
        const user2Payload = {
            UserName: 'student_iot',
            Password: 'StudentSecret456!',
            Email: 'student@sis.hust.edu.vn'
        };
        const postUser2 = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/Users',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, user2Payload);
        assert('POST /api/Users (user 2) returns 201 Created', postUser2.statusCode === 201);
        const user2Id = postUser2.data.Id;
        console.log(`       Created User 2: Id=${user2Id}, UserName="${postUser2.data.UserName}", Email="${postUser2.data.Email}"`);

        // GET /api/Users
        const getUsers = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/Users',
            method: 'GET'
        });
        assert('GET /api/Users returns 200 OK', getUsers.statusCode === 200);
        assert('GET /api/Users returns an array', Array.isArray(getUsers.data));
        console.log(`       Retrieved ${getUsers.data.length} users.`);

        // GET /api/Users/{id}
        const getUser1 = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/Users/${user1Id}`,
            method: 'GET'
        });
        assert(`GET /api/Users/${user1Id} returns 200 OK`, getUser1.statusCode === 200);
        assert(`Retrieved user matches Id=${user1Id}`, getUser1.data.Id === user1Id);

        // PUT /api/Users/{id}
        const updateUserPayload = {
            UserName: 'admin_iot_master',
            Password: 'NewSecurePassword789#',
            Email: 'admin.master@hust.edu.vn'
        };
        const putUser1 = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/Users/${user1Id}`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }, updateUserPayload);
        assert(`PUT /api/Users/${user1Id} returns 200 OK`, putUser1.statusCode === 200);
        assert('User email updated correctly', putUser1.data.Email === 'admin.master@hust.edu.vn');
        console.log(`       Updated User 1: New Name="${putUser1.data.UserName}", New Email="${putUser1.data.Email}"`);

        // DELETE /api/Users/{id}
        const delUser1 = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/Users/${user1Id}`,
            method: 'DELETE'
        });
        assert(`DELETE /api/Users/${user1Id} returns 200 OK`, delUser1.statusCode === 200);

        // GET /api/Users/{id} (verify deleted -> 404)
        const getDeletedUser = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/Users/${user1Id}`,
            method: 'GET'
        });
        assert(`GET deleted user ${user1Id} returns 404 Not Found`, getDeletedUser.statusCode === 404);

        // --- SWAGGER SPEC CHECK ---
        console.log('\n--- 4. Swagger Documentation Check ---');
        const swaggerRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/swagger.json',
            method: 'GET'
        });
        assert('GET /swagger.json returns 200 OK', swaggerRes.statusCode === 200);
        assert('Swagger spec contains /api/SensorDatas', Boolean(swaggerRes.data.paths && swaggerRes.data.paths['/api/SensorDatas']));
        assert('Swagger spec contains /api/Users', Boolean(swaggerRes.data.paths && swaggerRes.data.paths['/api/Users']));
        console.log(`       Swagger Spec Version: ${swaggerRes.data.openapi || swaggerRes.data.swagger}`);

        console.log(`\n=======================================================`);
        console.log(` SUMMARY: ${passedTests}/${totalTests} TESTS PASSED!`);
        console.log(`=======================================================`);

        if (passedTests === totalTests) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    } catch (error) {
        console.error('Test execution failed with error:', error);
        process.exit(1);
    }
}

runTests();
