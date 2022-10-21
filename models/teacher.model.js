'use strict'

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    subjects: {
        type: [String],
    }
});

module.exports = mongoose.model("Teacher", TeacherSchema);