const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
}
/**
 * 
 * @param {*} page 
 * @param {*} collection_alias 
 * @param {*} results_per_page 
 * @returns 
 */
const browseCollection = async (req, res) => {
  //If any of our parameters are missing
  if (!req.query.page || !req.query.collection_alias || !req.query.results_per_page) return res.status(400).json({message: "Missing one or more of three parameters: page, collection_alias, or results"});
    
  const page = parseInt(req.query.page);
  const collection_name = aliasToCollection[req.query.collection_alias];
  const results_per_page = parseInt(req.query.results_per_page);  
  
  const db = MongoClient.db("GlossaryEmergingTech");
  const collection = db.collection(collection_name);
  const results = await collection.find({}).skip((page-1)*results_per_page).limit(results_per_page).toArray();
  
  return res.send(results);
}

module.exports = browseCollection;