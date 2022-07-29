require('dotenv').config()

//First connect to MongoDB, then start Express server
const {MongoClient} = require("mongodb");
//This should be put into environnment variables
const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);
client.connect().then(() => {console.log("Successfully connected to Mongo")});

module.exports.client = client;