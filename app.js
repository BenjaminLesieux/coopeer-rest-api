'use strict'

const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const AutoLoad = require('@fastify/autoload');

const uri = process.env.DATABASE_URL.toString();
mongoose.Promise = global.Promise

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("database connected");
  console.log("successfully connected to mysql database")

  // const Class = require('/models/class.model')
  // const french = new Class({
  //   subject: "Français",
  //
  // })
})
// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}

module.exports = async function (fastify, opts) {
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
  await fastify.register(require('@fastify/cors'), {
    origin: '*'
  })

}
