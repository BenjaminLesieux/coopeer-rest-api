const User = require("../models/user.model");
const Teacher = require("../models/teacher.model");
const Class = require("../models/class.model");
const Course = require("../models/course.model");

const {isAuthenticated, decodeToken} = require("./helpers");

async function getAllClasses(req, res) {
    if (!isAuthenticated(req, res)) {
        return res.code(401).send("Cannot see list of classes if user is not connected");
    }

    const clazz = await Class.find();
    return res.code(200).send(clazz);
}

async function createNewCourse(req, res) {
    if (!isAuthenticated(req, res)) {
        return res.code(401).send("Cannot see list of courses if user is not connected");
    }

    const decodedToken = decodeToken(req, res);
    const user = await User.findOne({email:decodedToken.email});
    const course = new Course({date:Date.parse(req.body.date), subject:req.body.subject, teacherID:user.teacherID});
    course.students = [];

    await course.save();
    return res.code(200).send(course);
}

async function getAllCourses(req, res) {
    if (!isAuthenticated(req, res)) {
        return res.code(401).send("Cannot see list of courses if user is not connected");
    }

    const decodedToken = decodeToken(req, res);
    const user = await User.findOne({email:decodedToken.email});

    if (user.teacherID === undefined) {
        return res.code(401).send("not a teacher");
    }

    const course = await Course.find({teacherID:user.teacherID});
    return res.code(200).send(course);
}

async function registerToCourse(req, res) {
    if (!isAuthenticated(req, res)) {
        return res.code(401).send("Cannot register to course if user is not connected");
    }

    const {user, teacher} = await verifyAndGetUserAndTeacher(req, res);

    const course = await Course.findOne({teacherID:teacher._id, subject:req.body.subject});

    if (!course) return res.code(404).send("Couldn't find any courses");

    await course.update({$push:{students:user._id}});

    return res.ok(user.name + " " + user.surname + " was registered to the course : " + subject.name + " with " + teacher._id);
}

async function unregisterToCourse(req, res) {
    if (!isAuthenticated(req, res)) {
        return res.code(401).send("Cannot register to course if user is not connected");
    }

    const {user} = verifyAndGetUserAndTeacher(req, res);

    if (!user) return res.code(404).send("User was not found with this token");

    const course = await Course.findById({_id:req.body.courseID});

    if (!course) return res.code(404).send("Couldn't find any courses with such id");

    course.update({$pullAll:{students:user._id}});

    return res.ok().send("Student was removed from the course with success");
}

async function verifyAndGetUserAndTeacher(req, res) {
    const decodedToken = decodeToken(req, res);

    const user = await User.findOne({email:decodedToken.email});

    if (req.body !== undefined && req.body.teacherID !== undefined) {
        const teacher = await Teacher.findById({_id:req.body.teacherID});
        if (!teacher) return res.code(404).send("Teacher was not found with this teacher id");
    }

    if (!user) return res.code(404).send("User was not found with this token");

    return {user, teacher};
}

module.exports = {
    registerToCourse,
    unregisterToCourse,
    getAllClasses,
    getAllCourses,
    createNewCourse
}