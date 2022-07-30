const MongoClient = require("../MongoInit.js").client;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleLogout = async (req, res) => {
    //On client-side, also make sure to delete the access token you have
    const cookies = req.cookies;
    //If we dont have cookies, return. Also, if we do have cookies, but no jwt, return.
    if (!cookies?.jwt) return res.status(204).json({message: 'No need to logout, you were never logged in!'});
    const db = MongoClient.db('GlossaryEmergingTech');
    const collection = db.collection("Users");
    const refreshToken = cookies.jwt;
    //Find the person with the refresh token found in the header
    const refreshTokenInDB = await collection.findOne({refreshToken: refreshToken});
    if (!refreshTokenInDB) return res.status(403).json({message: "Invalid JWT"});
    //If we get this far, then the refreshToken is inside of the database and we need to delete it
    const foundUser = await collection.updateOne(
        {user: user},
        {$set: {
            refreshToken: null,
        }},
        { upsert: true }) //Update the user object with NO refreshToken
        //Now, clear the cookie from the header
        res.clearCookie('jwt', {httpOnly: true, secure: process.env.ENVIRONMENT === "PRODUCTION" ? true : false}); // secure: true for production- only serves on https protocol
}

module.exports = handleLogout;