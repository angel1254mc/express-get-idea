const allowedOrigins = require('./allowedOrigins');
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }
        else if (!origin || origin.includes('chrome-extension://'))
        {
            callback(null, true)
        }
        else
            callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;