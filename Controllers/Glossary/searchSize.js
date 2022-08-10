const { ObjectId } = require("mongodb");

const MongoClient = require("../../MongoInit.js").client;
const aliasToCollection = {
    'requested': 'TermsToBeAddedTest', //Change this for production environment
    'glossary': 'Terms'
  }

  /**
   * 
   * @param {*} collection_alias 
   * @param {*} search_term 
   * @returns 
   */
const searchSize = async (req, res) => {
    if (!req.query?.collection_alias) return res.status(400).json({message: "Please include collection_alias as a query param"});
    
    const collection_name = aliasToCollection[req.query.collection_alias];

    const db = MongoClient.db("GlossaryEmergingTech");
    const collection = db.collection(collection_name);
    
    let count;
    //If search is not empty
    if (req.query.search_term)
    {
      count = await collection.aggregate(constructAggregation(req.query.search_term, 100, 1)).toArray();
      count = count.length;
    }
    else //if search is empty, size of entire collection
      count = await collection.countDocuments({});
    
    return res.json({totalElements: count});
}


module.exports = searchSize;

const constructAggregation = (searchTerm, resultLimit, page) => {
  return [
      {
        $search: {
          index: "GETSearchOptimized",
          compound: {
            must: [
              {
                text: {
                  query: searchTerm,
                  path: "TITLE",
                  fuzzy: {
                    maxEdits: 1,
                  }
                }
              }
            ]
          }
        }
      },
      {
          $limit: (page-1)*resultLimit + resultLimit,
      },
      {
          $skip: (page-1)*resultLimit,
      },
      {
        $project: {
          TITLE: 2,
          DESCRIPTION: 1,
          SOURCE: 1,
          ABBREVIATIONS: 1,
          _id: 1,
          score: {
            $meta: "searchScore"
          },
        }
      }
    ]
}
