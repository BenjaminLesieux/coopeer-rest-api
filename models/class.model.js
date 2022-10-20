'use strict'

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Class", ClassSchema);