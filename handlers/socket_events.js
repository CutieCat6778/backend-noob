const { readdirSync } = require("fs");

module.exports = async(socket) => {
    const routes = await readdirSync('./src/socket_io/');
    for (let route of routes) {
        const file = require(`../socket_io/${route}`);
        const routeName = route.replace('.js', '');
        socket.on(routeName, file.bind(null, socket));
    }
}