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
    if (!TITLE || !SOURCE) return res.status(400).json({message: "Please include at least TITLE and SOURCE parameters, and optionally DESCRIPTION and ABBREVIATIONS params as well."})
    const newTerm = {
        'TITLE': TITLE,
        'DESCRIPTION': DESCRIPTION,
        'SOURCE': SOURCE,
        'ABBREVIATIONS': ABBREVIATIONS,
    }
    
    const db = MongoClient.db("GlossaryEmergingTech");
    const glossary = db.collection("Terms");
    const result = await glossary.insertOne(newTerm);

    return res.status(200).json({message: `Term successfully added with _id: ${result.insertedId}`, _id: result.insertedId})
}
module.exports = createTerm;