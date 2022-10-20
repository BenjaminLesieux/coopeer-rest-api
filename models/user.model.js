'use strict'

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
      type: String,
      default: "DefaultUser"
    },
    teacherID: {
        type: Number,
        ref: "Teacher",
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    surname: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    learningXP: {
        type: Number,
        required: true,
        default: 0,
    }
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("Peer", UserSchema);