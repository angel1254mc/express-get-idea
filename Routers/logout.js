const express = require('express')
const Router = express.Router();
const logoutController = require('../Controllers/logoutController.js');

Router.get('/', logoutController);

module.exports = Router;