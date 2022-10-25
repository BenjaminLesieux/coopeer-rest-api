const User = require("../models/user.model");
const Teacher = require("../models/teacher.model");
const Class = require("../models/class.model");
const Course = require("../models/course.model");
const jwt = require("jsonwebtoken");

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
    const course = new Course({teacherID:user.teacherID});

    course.date = req.body.date;
    course.subject = req.body.subject;
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

    const course = await Course.find();
    return res.code(200).send(course);
}

async function registerToCourse(req, res) {
    if (!isAuthenticated(req, res)) {
        return res.code(401).send("Cannot register to course if user is not connected");
    }

    const {user, teacher} = await verifyAndGetUserAndTeacher(req, res);

    if (user.teacherID === teacher._id) return res.code(401).send({"error": "cannot attend your own classes"});

    const course = await Course.findOne({teacherID:req.body.teacherID, subject:req.body.subject, _id:req.body._id});

    if (!course) return res.code(404).send("Couldn't find any courses");

    if (course.students.includes(user._id)) return res.code(401).send({"error":"Already registered to this course"});

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
    let teacher = null;

    if (req.body !== undefined && req.body.teacherID !== undefined) {
        teacher = await Teacher.findById({_id:req.body.teacherID});
        if (!teacher) return res.code(404).send("Teacher was not found with this teacher id");
    }

    else if (user.teacherID !== undefined) {
        teacher = await Teacher.findById({_id:user.teacherID});
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