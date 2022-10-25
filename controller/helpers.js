const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");

function decodeToken (req, res) {
    const header = req.headers["authorization"];

    if (header === undefined) {
        return res.code(401).send("No token found");
    }

    const token = header.replace("Token ", "");
    return jwtDecode(token);
}

function isAuthenticated(req, res) {
    return req.headers["authorization"] !== undefined && jwt.verify(req.headers["authorization"].replace("Token ", ""), process.env.SECRET);
}

module.exports = {
    decodeToken,
    isAuthenticated
}