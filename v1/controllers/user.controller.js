'use strict';

const UserService = require('../services/user.service');

class UserController {
    static async getAll(req, res, next) {
        try {
            const users = await UserService.getAll();
            return res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.getById(id);
            if (!user) {
                return res.status(404).json({
                    message: `User with Id=${id} not found`
                });
            }
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const { UserName, Password, Email } = req.body;
            if (!UserName || !Password || !Email) {
                return res.status(400).json({
                    message: 'UserName, Password and Email are required'
                });
            }
            const newUser = await UserService.create(req.body);
            return res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await UserService.update(id, req.body);
            if (!updated) {
                return res.status(404).json({
                    message: `User with Id=${id} not found`
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
            const deleted = await UserService.delete(id);
            if (!deleted) {
                return res.status(404).json({
                    message: `User with Id=${id} not found`
                });
            }
            return res.status(200).json(deleted);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
