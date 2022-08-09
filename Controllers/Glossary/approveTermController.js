const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
  }

const approveTerm = async (req, res) => {
    if (!req.body?.id) return res.status(400).json({message: "Please include id parameter for term to approve, and updated term if any changes were made"});
    if (req.body?.update && (!req.body.update.TITLE || !req.body.update.SOURCE)) return res.status(400).json({message: "If updated term is included, please include at least TITLE and SOURCE"})
    let updateTerm = null;
    if (req.body.update)
    {
      const TITLE = req.body.update.TITLE;
      const DESCRIPTION = req.body.update.DESCRIPTION ? req.body.update.DESCRIPTION : "";
      const SOURCE = req.body.update.SOURCE;
      const ABBREVIATIONS = req.body.update.ABBREVIATIONS ? req.body.update.ABBREVIATIONS : "";
      
      updateTerm = {
        'TITLE': TITLE,
        'DESCRIPTION': DESCRIPTION,
        'SOURCE': SOURCE,
        'ABBREVIATIONS': ABBREVIATIONS,
      }
    }
    const _id = new ObjectId(req.body.id);
    
    const db = MongoClient.db("GlossaryEmergingTech");
    const collection = db.collection("TermsToBeAddedTest");
    const foundTerm = await collection.findOne({'_id': _id});

    const glossary = db.collection("Terms");
    
    if (!foundTerm) return res.status(400).json({message: "Term no longer exists in requested term database"});
    
    await collection.deleteOne({'_id': _id})
    await glossary.insertOne(updateTerm ? updateTerm :  foundTerm);

    return res.status(200).json({message: "Successfully approved term: can now be found in glossary"});
}

module.exports = approveTerm;