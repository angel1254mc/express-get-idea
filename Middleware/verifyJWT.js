
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
/**
 * @function verifyJWT is a middleware that validates the authentication of the requester using an access token, then modifies the request to be validated w/ username 
 * @param {request} req 
 * @param {response} res 
 * @param {callback} next middleware 
 * @returns 
 */
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) res.status(401).json({message: "Error: Not authenticated"});
    //Line above is for when the header does not exist in the http header
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message: "Forbidden. Token is invalid or has been tampered with"})
            req.user = decoded.username;
            return next(); // Go to the next thing, after the middleware
        }
    )
}

module.exports = verifyJWT;