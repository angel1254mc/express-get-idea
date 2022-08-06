const allowedOrigins = [
    'https://www.eventually-admin-portal',
    'http://localhost:3000',
    process.env.PORT ? process.env.PORT : 'https://get-server-prod.herokuapp.com/'
]
module.exports = allowedOrigins;