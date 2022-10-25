'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    name: {
        type: String
    },
    image: {
        type: String,
    }
});

module.exports = mongoose.model("Class", ClassSchema);