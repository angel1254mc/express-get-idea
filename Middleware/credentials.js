const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin) res.header('Access-Control-Allow-Credentials', true);
    next();
}

module.exports = credentials;