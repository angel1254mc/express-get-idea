
//Note, this server should only be used for read operations, unless proper authentication measures have been placed. Term requests can be processed
//Importing dotenv functionality
const glossary = require("./Routers/glossary.js");
const addTerm = require("./Routers/addterm.js")
const register = require("./Routers/register.js");
const login = require("./Routers/login.js");
//Want to have a really concise way of constructing the aggregation query
/**
 * @Function ConstructAggregation returns a properly formatted text $search query based on a searchTerm, desired limit of results, and some pagination
 * @param {*} searchTerm The term to be searched for
 * @param {*} resultLimit The limit of results that can be obtained
 * @param {*} page decides the amount of skips to emulate pagination, following (page-1)*resultLimit
 * @returns a fully constructed search query suitable for the aggregate function. Currfently only works with the "GETSearchOptimized" Index
 */

//Then Begin Express Server
const path = require("path")
const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var jsonParser = bodyParser.json()

app.use(cors()); //Utilize CORS later to only whitelist certain requests.
app.use(jsonParser);
app.use(cookieParser)
/**
 * Base Path sends an html path introducing the user to the GET API
 * Possibly in the future include a description of what the API does and the company behind it (Emerging  Tech)
 */
app.get('/' , async (req, res) => {
  res.sendFile(path.join(__dirname, "render_src/index.html"))
});

app.use('/glossary', glossary);
app.use('/addterm', addTerm);
app.use('/register', register);
app.use('/login', login)

app.listen(process.env.PORT || 3000, () => {
    console.log("Server began listening on port 3000.");
})
