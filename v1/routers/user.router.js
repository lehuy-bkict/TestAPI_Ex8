'use strict';

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *           description: The auto-generated id of the user
 *           example: 1
 *         UserName:
 *           type: string
 *           description: The user's account name
 *           example: "nguyen_van_a"
 *         Password:
 *           type: string
 *           description: The user's password
 *           example: "123456@Abc"
 *         Email:
 *           type: string
 *           description: The user's email address
 *           example: "vana@hust.edu.vn"
 *     UserInput:
 *       type: object
 *       required:
 *         - UserName
 *         - Password
 *         - Email
 *       properties:
 *         UserName:
 *           type: string
 *           example: "nguyen_van_a"
 *         Password:
 *           type: string
 *           example: "123456@Abc"
 *         Email:
 *           type: string
 *           example: "vana@hust.edu.vn"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management Web API
 */

/**
 * @swagger
 * /api/Users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input parameters
 */
router.route('/')
    .get(UserController.getAll)
    .post(UserController.create);

/**
 * @swagger
 * /api/Users/{id}:
 *   get:
 *     summary: Get a user by Id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user Id
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update an existing user by Id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete a user by Id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user Id
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.route('/:id')
    .get(UserController.getById)
    .put(UserController.update)
    .delete(UserController.delete);

module.exports = router;
