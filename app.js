'use strict'

const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const AutoLoad = require('@fastify/autoload');
const {jwtDecode} = require('jwt-decode');

const uri = process.env.DATABASE_URL.toString();
mongoose.Promise = global.Promise

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("database connected");
  console.log("successfully connected to mysql database")
})
// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}