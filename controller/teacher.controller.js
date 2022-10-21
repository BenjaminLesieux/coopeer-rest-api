const User = require("../models/user.model");
const Teacher = require("../models/teacher.model");
const Class = require("../models/class.model");


const jwtDecode = require("jwt-decode");
const {sub} = require("tap");


function registerTeacher(req, res) {
    if (req.headers["authorization"] === undefined) {
        res.code(401).send("Must be connected to access this route");
        return;
    }

    const decodedToken = decodeToken(req, res);

    User.findOne({email: decodedToken.email}, (err, user) => {
        if (err) return res.code(500).send("Error on the server.");
        if (!user) return res.code(404).send("No user found with this email");

        if (user.teacherID !== undefined) return res.code(200).send("User is already a teacher");

        const classes = req.body.subjects;
        const teacher = new Teacher(classes);
        teacher.subjects = classes;

        teacher.save().then(teacher => {
            user.teacherID = teacher._id;

            user.save().then(user => {
                console.log("Added teacher id to user " + user._id);
            });

            res.code(200).send({
                create: true,
                teacher: teacher,
                user: user,
            })
        });
    });
}

async function addSubjects(req, res) {
    if (req.headers["authorization"] === undefined) {
        return res.code(401).send("User must be connected");
    }

    const decodedToken = decodeToken(req, res);

    const user = await User.findOne({email:decodedToken.email}).exec();
    const teacher = await Teacher.findById({_id: user.teacherID}).exec();

    if (!teacher) return res.code(404).send("Cannot find any teacher, is the user logged as a teacher ?");

    for (const subject of req.body.subjects) {
        const validatedSubject = await Class.findOne({name:subject}).exec();

        console.log(validatedSubject)

        if (!validatedSubject) {
            console.error(validatedSubject + " does not exists. Ignoring it.");
            continue;
        }
        if (teacher.subjects.includes(validatedSubject)) continue;

        await teacher.update({$push:{subjects:subject}});
    }
}

const decodeToken = (req, res) => {
    const header = req.headers["authorization"];

    if (header === undefined) {
        return res.code(401).send("No token found");
    }

    const token = header.replace("Token ", "");
    return jwtDecode(token);
}

module.exports = {
    registerTeacher,
    addSubjects
}