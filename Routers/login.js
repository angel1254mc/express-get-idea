const express = require('express')
const Router = express.Router();
const authController = require('../Controllers/authController.js');

Router.post('/', authController);

module.exports = Router;
//woah