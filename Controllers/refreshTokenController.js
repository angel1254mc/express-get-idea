const MongoClient = require("../MongoInit.js").client;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleRefreshToken = async (req, res) => {
    
    const cookies = req.cookies;
    //If we dont have cookies, return. Also, if we do have cookies, but no jwt, return.
    if (!cookies?.jwt) return res.status(401).json({message: 'Missing cookies and/or JWT auth token'});
    const db = MongoClient.db('GlossaryEmergingTech');
    const collection = db.collection("Users");
    const refreshToken = cookies.ETGETjwt;
    //Find the person with the refresh token found in the header
    const foundUser = await collection.findOne({refreshToken: refreshToken});
    if (!foundUser) return res.status(403).json({message: "The user for the refreshToken doesn't exist"});
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.user !== decoded.user) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "user" : decoded.user },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30'}
            );
            return res.json({accessToken})
        }
    )
}

module.exports = handleRefreshToken;