const routerMethods = require("express").Router();

const SubscriberService = require("../services/subscriber");

routerMethods.post("/create", (request, response) => {
  const subscriberMethods = new SubscriberService(request.body, response);
  subscriberMethods.createSubscriber();
});

module.exports = routerMethods;
