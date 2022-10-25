'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    teacherID: {
        type: String,
        ref: "Teacher"
    },
    students: {
        type: [String],
        ref: "Peer"
    }
});

module.exports = mongoose.model("Course", CourseSchema);