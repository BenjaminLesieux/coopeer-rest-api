'use strict'

const teacherController = require("../../controller/teacher.controller");

module.exports = function (fastify, opts, done) {
    fastify.post('/teacher/register', function (request, reply) {
        return teacherController.registerTeacher(request, reply);
    });

    fastify.post('/teacher/subjects', function (request, reply) {
       return teacherController.addSubjects(request, reply);
    });

    done();
}