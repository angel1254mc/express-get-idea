const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
  }

  /**
   * 
   * @param {*} id 
   * @param {*} collection_alias 
   * @returns 
   */
const findByIdController = async (req, res) => {
    if (!req.query?.id || !req.query?.collection_alias) return res.status(400).json({message: "Please include both id & collection_alias"});

    const collection_name = aliasToCollection[req.query.collection_alias];

    if (!ObjectId.isValid(req.query.id)) return res.status(400).json({message: "Invalid param: id must be valid Object ID"});
    
    const _id = new ObjectId(req.query.id);

    const db = MongoClient.db("GlossaryEmergingTech");
    const collection = db.collection(collection_name);
    const foundTerm = await collection.findOne({'_id': _id});

    return res.json(foundTerm);
}

module.exports = findByIdController;