
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
    const token = req.cookies?.etgetjwt;
    console.log("we mad it here")
    console.log(token)
    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({message: "Forbidden. Token is invalid or has been tampered with"})
            req.user = decoded.username;
            return next(); // Go to the next thing, after the middleware
        }
    )
}

module.exports = verifyJWT;