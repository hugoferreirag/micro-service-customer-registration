const routersModel = require('express').Router();
const loginMethods = require('./auth');
const subscriberMethods = require('./subscriber');

routersModel.use('/login', loginMethods);
routersModel.use('/subscriber', subscriberMethods);

module.exports = routersModel;
