'use strict'

const coursesController = require("../../controller/course.controller");

module.exports = async function (fastify, opts) {
    await fastify.post('/course/register', function (request, reply) {
        return coursesController.registerToCourse(request, reply);
    });

    await fastify.delete('/course/subjects', function (request, reply) {
        return coursesController.unregisterToCourse(request, reply);
    });

    await fastify.get('/courses', function (request, reply) {
       return coursesController.getAllCourses(request, reply);
    });

    await fastify.post('/courses', function (request, reply) {
        return coursesController.createNewCourse(request, reply);
    });

    await fastify.get('/classes', function (request, reply) {
       return coursesController.getAllClasses(request, reply);
    });
}