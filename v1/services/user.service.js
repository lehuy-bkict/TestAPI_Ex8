'use strict';

const { UserModel } = require('../../database_model/modelUser');

class UserService {
    static async getAll() {
        return await UserModel.find().sort({ Id: 1 });
    }

    static async getById(id) {
        const numId = Number(id);
        if (isNaN(numId)) return null;
        return await UserModel.findOne({ Id: numId });
    }

    static async create(payload) {
        const { UserName, Password, Email } = payload;
        const newRecord = new UserModel({
            UserName,
            Password,
            Email
        });
        return await newRecord.save();
    }

    static async update(id, payload) {
        const numId = Number(id);
        if (isNaN(numId)) return null;

        const updateData = { updatedAt: new Date() };
        if (payload.UserName !== undefined) updateData.UserName = payload.UserName;
        if (payload.Password !== undefined) updateData.Password = payload.Password;
        if (payload.Email !== undefined) updateData.Email = payload.Email;

        return await UserModel.findOneAndUpdate(
            { Id: numId },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    }

    static async delete(id) {
        const numId = Number(id);
        if (isNaN(numId)) return null;
        return await UserModel.findOneAndDelete({ Id: numId });
    }
}

module.exports = UserService;
