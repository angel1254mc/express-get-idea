const MongoClient = require("../MongoInit.js").client;
const bcrypt = require('bcrypt');


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
        return res.status(201).json({message: `Login Successful, user ${user} is now logged in.`})
    } 
    else //If passwords don't match
        return res.status(401).json({message: 'Username or password is incorrect'});
}

module.exports = loginUser;