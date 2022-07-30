const express = require('express')
const Router = express.Router();
const registerController = require('../Controllers/registerController');
const verifyJWT = require('../Middleware/verifyJWT.js');

Router.post('/', verifyJWT, registerController);


module.exports = Router;