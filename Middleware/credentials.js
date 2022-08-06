const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    console.log(allowedOrigins);
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    else if (!origin || origin.includes('chrome-extension://'))
        res.header('Access-Control-Allow-Credentials', true);
    next();
}

module.exports = credentials;