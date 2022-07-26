const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyServerAccess = (req, res, next) => {
    const API_key = req.body.SERVER_SECRET_API_KEY
    if (API_key === process.env.SERVER_SECRET_API_KEY)
        return next();
    else
        return res.status(403).json({message: "Forbidden. API key incorrect or not included"});
}

module.exports = verifyServerAccess;