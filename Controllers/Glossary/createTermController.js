const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
}

const createTerm = async (req, res) => {
    if (!req.body) return res.status(400).json({message: "Please include term details in body with post request"});
    const TITLE = req.body.TITLE;
    const DESCRIPTION = req.body.DESCRIPTION;
    const SOURCE = req.body.SOURCE;
    const ABBREVIATIONS = req.body.ABBREVIATIONS;
    
}
module.exports = createTerm;