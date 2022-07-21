
//Note, this server should only be used for read operations, unless proper authentication measures have been placed. Term requests can be processed
//Importing dotenv functionality
require('dotenv').config()

//Want to have a really concise way of constructing the aggregation query
/**
 * @Function ConstructAggregation returns a properly formatted text $search query based on a searchTerm, desired limit of results, and some pagination
 * @param {*} searchTerm The term to be searched for
 * @param {*} resultLimit The limit of results that can be obtained
 * @param {*} page decides the amount of skips to emulate pagination, following (page-1)*resultLimit
 * @returns a fully constructed search query suitable for the aggregate function. Currfently only works with the "GETSearchOptimized" Index
 */
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
            $limit: resultLimit,
        },
        {
            $skip: (page-1)*resultLimit,
        },
        {
          $project: {
            TITLE: 2,
            DESCRIPTION: 1,
            SOURCE: 1,
            _id: 0,
            score: {
              $meta: "searchScore"
            },
          }
        }
      ]
}

//First connect to MongoDB, then start Express server
const path = require("path")
const {MongoClient} = require("mongodb");
//This should be put into environnment variables
const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);
client.connect().then(() => {console.log("Successfully connected to Mongo")});

//Then Begin Express Server
const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors()); //Utilize CORS later to only whitelist certain requests.

/**
 * Base Path sends an html path introducing the user to the GET API
 * Possibly in the future include a description of what the API does and the company behind it (Emerging  Tech)
 */
app.get('/' , async (req, res) => {
    res.sendFile(path.join(__dirname, "render_src/index.html"))
})

/** GLOSSARY
 * @path /glossary is going to be the starting point for a number of operations
 * @path /glossary? - Queries done on glossary are specifically for searching for terms on the database. More information on query parameters below
 * @path /glossary/term - The base URL for receiving the definition and extra details of an exact term. Virtually useless, requires an extra param /:term to get the information for
 */

/**
 * @PATH /glossary?
 * @request a GET Request meant to query the server for a term, that the server will conduct a search for in the database.
 * @param term: a URI decoded string - the "search term" to be used in the search query
 * @param page: "page" of results that is trying to be accessed. Implementation currently in progress
 * @param results_per_page: The amount of results to be returned per page when the search query is conducted.
 * @response an array of "term" objects containing info about the search results, such as the term name "TITLE", the term description "DESCRIPTION", and the source "SOURCE"
 * @note all of the info returned in the term "objects" can be verified using Object.keys();
 */
app.get('/glossary', async (req, res) => {
    if (req.query && req.method == "GET") //If the http request contains query parameters and is a "GET" request,
    {
        const termToSearchFor = decodeURIComponent(req.query.term);
        const page  = req.query.page ? req.query.page : 1;
        const results_per_page = req.query.results_per_page ? req.query.results_per_page : 3;

        try {
            const db = client.db("GlossaryEmergingTech");
            const collection = db.collection("Terms");
            const results = await collection.aggregate(constructAggregation(termToSearchFor, results_per_page, page)).toArray()
            /**@const results is an array of "term" objects with term info, abbreviation, definition, and source. Defaults to a length of 3, but can be changed */
            return res.send(results);
        }
        catch (err) /* Meant to catch any errors that occur as a result of trying to retrieve the collection aggregate. */ {
            console.log("Error ocurred: ", err)
            res.status(500).send("Internal Server Error at OptimizedSearch - Check MongoDB collection code");
        }
    }
    else
    {
        res.send("Incorrect usage of API path, please either perform a GET request or specify query parameters");
    }

})
/**
 * @PATH glossary/term/:term
 * @request A GET request that queries the server for a more thorough collection of information regarding the specific term. In the future, this could be used to display information beyond that
 * already displayed by the /glossary? search query
 * @response A more comprehensive collection of information relating to the term in the parameter.
 * @param term A string that refers to the term whose definition is sought.
 * @note @param term MUST match the "TITLE" or "TERM" of at least one document (Item) in the mongoDB collection, otherwise this route will return nothing
 */
app.get('/glossary/term/:term', async (req, res) => {
    if (req.method == "GET" && req.params.term)
    {
      try {
        console.log(req.params.term);
        const db = client.db("GlossaryEmergingTech");
        const collection = db.collection("Terms");
        const term_retrieved = await collection.findOne( {
          'TITLE': req.params.term
        }
        )
        res.send(term_retrieved);
      }
      catch (err) {
        console.log("Internal Server Error at /glossary/terms/:term", err)
      }
    }
    else
    {
      res.send("Incorrect usage of API endpoint: Please perform a GET request and ensure a parameter has been provided in the slug")
    } 
    
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server began listening on port 3000.");
})
