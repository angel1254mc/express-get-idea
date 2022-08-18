const MongoClient = require("../MongoInit.js").client;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const loginUser = async (req, res) => {
    const db = MongoClient.db('GlossaryEmergingTech');
    const collection = db.collection("Users");
    const {user, password} = req.body;
    if (!user || !password) return res.status(400).json({message: 'both username and password are required'});
    const userInDB = await collection.findOne({user: user});
    if (!userInDB) return res.status(401).json({message: "User does not exist or has not registered"});
    //Now check if password matches user in db
    const compare = await bcrypt.compare(password, userInDB.password);
    if (compare) //If passwords match, then
    {  
        const accessToken = jwt.sign(
            { "user": userInDB.user},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            { "user": userInDB.user},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        await collection.updateOne(
            {user: user},
            {$set: {
                refreshToken: refreshToken,
            }},
            { upsert: true }) //Update the user object with the new access token

        res.cookie('ETGETjwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 60*60*1000});
        return res.status(201).json({
            message: `Login Successful, user ${user} is now logged in.`,
            accessToken: accessToken })
    } 
    else //If passwords don't match
        return res.status(401).json({message: 'Username or password is incorrect'});
}

module.exports = loginUser;