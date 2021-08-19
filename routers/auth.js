const routerMethods = require("express").Router();
const AuthService = require("../services/auth");

routerMethods.post("/login", (request, response) => {
  const authService = new AuthService(request.body, response);
  authService.login();
});

module.exports = routerMethods;
