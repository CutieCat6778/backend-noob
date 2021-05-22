const { readdirSync } = require("fs")
const routes = readdirSync('./routes');

module.exports = async(app) => {
    for (let route of routes) {
        if(route.startsWith('-')){
            const file = require(`../routes/${route}`);
            let routeName = route.replace('.js', '')
            routeName = routeName.replace(/-/g, "/");
            app.use(routeName, file);
        }
    }
}