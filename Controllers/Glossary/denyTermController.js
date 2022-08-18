const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
}

const denyTerm = async (req, res) => {
    if (!req.body.id) return res.status(400).json({message: "Please include id parameter for term to deny"});

    if (!ObjectId.isValid(req.body.id)) return res.status(400).json({message: "Please include valid object id value"});
    
    const _id = new ObjectId(req.body.id);

    const db = MongoClient.db("GlossaryEmergingTech");
    const collection = db.collection("TermsToBeAddedTest");
    const foundTerm = await collection.findOne({'_id': _id});

    if (foundTerm) 
        await collection.deleteOne({'_id': _id})
    const emails = foundTerm['REQUESTER_EMAIL'];
    /**TBI: Do something with requester emails */

    return res.status(200).json({message: "Successfully denied requested term"});
}

module.exports = denyTerm;