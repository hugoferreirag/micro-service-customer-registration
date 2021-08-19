const routerMethods = require('express').Router();

routerMethods.post('/', (request, response) => {
    console.log('login susseded');
})

module.exports = routerMethods;