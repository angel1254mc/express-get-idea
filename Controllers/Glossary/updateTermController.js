const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
}

const updateTerm = async (req, res) => {
    
    if (!req.body?.id || !req.body?.update) return res.status(400).json({message: "Please include both valid ObjectID string of term to update and updated term object ({'TITLE','DESCRIPTION','SOURCE','ABBREVIATIONS'})"});
    
    if (!ObjectId.isValid(req.body.id)) return res.status(400).json({message: "Please ensure ID is valid ObjectId value"});
    
    const _id = new ObjectId(req.body.id);

    if (!req.body.update.TITLE || !req.body.update.SOURCE) return res.status(400).json({message: "Please include at least SOURCE and TITLE of term in order to update"});
    
    const TITLE = req.body.update.TITLE;
    const DESCRIPTION = req.body.update.DESCRIPTION ? req.body.update.DESCRIPTION : "";
    const SOURCE = req.body.update.SOURCE;
    const ABBREVIATIONS = req.body.update.ABBREVIATIONS ? req.body.update.ABBREVIATIONS : "";
    
    const updateTerm = {
      'TITLE': TITLE,
      'DESCRIPTION': DESCRIPTION,
      'SOURCE': SOURCE,
      'ABBREVIATIONS': ABBREVIATIONS,
    }

    const db = MongoClient.db("GlossaryEmergingTech");
    const glossary = db.collection("Terms");
    const update = await glossary.updateOne({'_id': _id}, {
        $set : updateTerm
    })
    return res.status(200).json({message: `${update.matchedCount} document(s) matched the filter, updated ${update.modifiedCount} document(s)`})
}

module.exports = updateTerm;