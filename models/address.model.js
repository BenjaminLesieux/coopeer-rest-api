'use strict'

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
});

module.exports = mongoose.model("Address", AddressSchema);