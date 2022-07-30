const express = require('express')
const Router = express.Router();
const refreshTokenController = require('../Controllers/refreshTokenController.js');

Router.get('/', refreshTokenController);

module.exports = Router;