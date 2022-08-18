
const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
}

const deleteTerm = async (req, res) => {
    if (!req.body || !req.body.id) return res.status(400).json({message: "Please include an id parameter in the body corresponding to the element to delete"});
    
    if (!ObjectId.isValid(req.body.id)) return res.status(400).json({message: "Please ensure ID is valid ObjectId value"});

    const _id = new ObjectId(req.body.id);

    const db = MongoClient.db("GlossaryEmergingTech");
    const glossary = db.collection("Terms");

    const foundTerm = await glossary.findOne({'_id': _id});

    if (!foundTerm) return res.status(400).json({message: `Term/Document with ObjectID '${req.body.id}' does not exist.`});

    const result = await glossary.deleteOne({'_id': _id});
    if (result.deletedCount === 1) {
        return res.status(200).json({message: `Term/Document with ObjectID '${req.body.id}' was successfully deleted`})
    }
    else if (result.deletedCount === 0)
        return res.status(400).json({message: `Term/Document with ObjectID '${req.body.id}' was not deleted`})
    else
        return res.status(401).json({message: "Error- Internal Server Error"})
}

module.exports = deleteTerm;