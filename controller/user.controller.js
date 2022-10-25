const User = require("../models/user.model");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

function getUsers(req, res) {
    User.find().then(users => {
       return res.code(200).send(users);
    });
}
//TODO: doc
function register(req, res) {
    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);

    newUser.save().then(user => {
       const token = jwt.sign(
           { email: user.email, name: user.name, surname: user.surname, _id: user._id },
           process.env.SECRET,
           { expiresIn: 86400 } // 24 hours
       );

       res.code(200).send({
           auth: true,
           token: token,
           user: user
       });
    }).catch(err => {
        return res.code(403).send({
            auth: false,
            error_message: err
        });
    });
}

//TODO: doc
function logIn(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
       if (err) return res.code(500).send("Error on the server.");

       if (!user) return res.code(404).send("No user found with email " + req.body.email);

       const validPassword = bcrypt.compareSync(req.body.password, user.password);

       if (!validPassword)
       return res.code(401).send({
           auth: false,
           token: null,
       });

       const token = jwt.sign(
           { email: user.email, name: user.name, surname: user.surname, _id: user._id},
           process.env.SECRET,
           { expiresIn: 86400 } // 24 hours
       );

       res.code(200).send({
           auth: true,
           token: token,
           user: user
       });
    });
}

//TODO: doc
function loginRequired(req, res, next) {
    if (jwt.verify(req.params.token, process.env.SECRET)) {
        next();
    }

    else {
        return res.code(401).json({ "message" : "unauthorized user" });
    }
}

module.exports = {
    register,
    logIn,
    getUsers
}