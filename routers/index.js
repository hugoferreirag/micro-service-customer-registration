const routersModel = require("express").Router();
const loginMethods = require("./auth");
const subscriberMethods = require("./subscriber");

routersModel.use("/auth", loginMethods);
routersModel.use("/subscriber", subscriberMethods);

module.exports = routersModel;
