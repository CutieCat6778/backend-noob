const { readdirSync } = require("fs")
const routers = require('express').Router();
const routes = readdirSync('./routes/_api');

for (let route of routes) {
    const file = require(`../routes/_api/${route}`);
    let routeName = route.replace('.js', '')
    routeName = routeName.replace(/-/g, "/");
    routers.use(routeName, file);
}

module.exports = routers;