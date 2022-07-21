//Want to have a really concise way of constructing the aggregation query
/**
 * @Function ConstructAggregation returns a properly formatted text $search query based on a searchTerm, desired limit of results, and some pagination
 * @param {*} searchTerm The term to be searched for
 * @param {*} resultLimit The limit of results that can be obtained
 * @param {*} page decides the amount of skips to emulate pagination, following (page-1)*resultLimit
 * @returns 
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
const {MongoClient} = require("mongodb");
const URI = "mongodb+srv://angel1254mc:Angelandres1254!@cluster0.asphi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(URI);
client.connect().then(() => {console.log("Successfully connected to Mongo")});

//Then Begin Express Server
const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/' , async (req, res) => {
    res.send("Hello My Friend, You have reached the base url of the express server");
})
app.get('/glossary', async (req, res) => {
    if (req.query && req.method == "GET")
    {
        const termToSearchFor = decodeURIComponent(req.query.term);
        const page  = req.query.page;

        try {
            const db = client.db("GlossaryEmergingTech");
            const collection = db.collection("Terms");
            const results = await collection.aggregate(constructAggregation(termToSearchFor, 3, page)).toArray()
            return res.send(results);
        }
        catch (err) {
            console.log("Error ocurred: ", err)
            res.status(500).send("Internal Server Error at OptimizedSearch")
        }
    }
    else
    {
        res.send("Please either provide a query or specify a term")
    }

})
app.get('/glossary/term/:term', async (req, res) => {
    const termToSearchFor = decodeURIComponent(req.params.term);
    
})

app.listen(3000, () => {
    console.log("Server began listening on port 3000.");
})
