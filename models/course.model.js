'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    date: {
        type: Date
    },
    subject: {
        type: String
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