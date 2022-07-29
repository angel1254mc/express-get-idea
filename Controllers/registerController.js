const MongoClient = require("../MongoInit.js").client;
const bcrypt = require('bcrypt');


const registerUser = async (req, res) => {
    const db = MongoClient.db('GlossaryEmergingTech');
    const collection = db.collection("Users");
    const {user, password} = req.body;
    //If one param is missing
    if (!user || !password) return res.status(400).json({message: "Please provide both username and password."});
    //Check for duplicate users
    const duplicateUser = await collection.findOne({user: user});
    //if duplicateUser exists, then user is already in the db
    if (duplicateUser) return res.status(409).json({message: "User seems to already be registered. Use the Login portal"});
    try {
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //Create New User
        await collection.insertOne({
            user: user,
            password: hashedPassword
        })
        //await user being added to MongoDB
        //Then, confirm that the user has been successfully created
        res.status(201).json({message: `Successfully created new user: ${user}.`})
    }
    catch (err) {
        //If this fires, there was an internal server error
        res.status(500).json({message: "Something went wrong on the server-side when creating user."})
    }

}

module.exports = registerUser;