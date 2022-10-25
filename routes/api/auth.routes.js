'use strict'

const userController = require("../../controller/user.controller")

module.exports = function (fastify, opts, done) {
    fastify.post('/auth/register', function (request, reply) {
        return userController.register(request, reply);
    });

    fastify.post('/auth/login', function (request, reply) {
       return userController.logIn(request, reply);
    });

    fastify.get('/users', function (request, reply) {
       return userController.getUsers(request, reply);
    });

    fastify.get('/users/:id', function (request, reply) {
        return userController.getUserById(request, reply);
    });

    done();
}