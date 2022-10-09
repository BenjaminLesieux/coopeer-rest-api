'use strict'

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
});

module.exports = mongoose.model("Teacher", TeacherSchema);