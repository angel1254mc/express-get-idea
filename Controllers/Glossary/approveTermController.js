const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
  }

const approveTerm = async (req, res) => {
    if (!req.body.id) return res.status(400).json({message: "Please include id parameter for term to approve"});
    
    const _id = new ObjectId(req.body.id);

    const db = MongoClient.db("GlossaryEmergingTech");
    const collection = db.collection("TermsToBeAddedTest");
    const foundTerm = await collection.findOne({'_id': _id});
    const glossary = db.collection("Terms");
    if (!foundTerm) return res.status(400).json({message: "Term no longer exists in requested term database"});
    
    await collection.deleteOne({'_id': _id})
    await glossary.insertOne(foundTerm);

    return res.status(200).json({message: "Successfully approved term: can now be found in glossary"});
}

module.exports = approveTerm;