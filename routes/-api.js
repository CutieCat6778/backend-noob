const { readdirSync } = require("fs")
const routers = require('express').Router();
const routes = readdirSync('./routes/_api');

module.exports = (io) => {
    console.log(io.sockets.id)
    for (let route of routes) {
        const file = require(`../routes/_api/${route}`)(io);
        console.log(file)
        let routeName = route.replace('.js', '')
        routeName = routeName.replace(/-/g, "/");
        routers.use(routeName, file);
    }
    return routers;
}