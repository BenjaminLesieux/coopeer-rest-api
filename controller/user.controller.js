const User = require("../models/user.model");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

//TODO: doc
function register(req, res) {
    console.log(req);
    let newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);

    newUser.save().then(user => {
       const token = jwt.sign(
           { email: user.email, name: user.name, surname: user.surname, _id: user._id },
           process.env.SECRET,
           { expiresIn: 86400 } // 24 hours
       );

       res.status(200).send({
           auth: true,
           token: token,
           user: user
       });
    }).catch(err => {
        return res.status(403).send({
            auth: false,
            error_message: err
        });
    });
}

//TODO: doc
function logIn(req, res) {
    console.log(req.body);
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

module.exports = {
    register,
    logIn
}