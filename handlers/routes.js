const { readdirSync } = require("fs")

module.exports = async (app) => {
    const routes = await readdirSync('./routes/');
    for (let route of routes) {
        if(!route.startsWith('_')){
            if (route.endsWith('.js')) {
                const file = require(`../routes/${route}`);
                let routeName = route.replace('.js', '')
                routeName = routeName.replace(/-/g, "/");
                app.use(routeName, file);
                console.log(`loaded ${routeName}`)
            }
            else if (!route.endsWith('.js')) {
                const sub_routes = await readdirSync('./routes/' + route);
                for (let sub_route of sub_routes) {
                    const file = require(`../routes/${sub_route}`);
                    let routeName = sub_route.replace('.js', '')
                    routeName = routeName.replace(/-/g, "/");
                    app.use(routeName, file);
                    console.log(`loaded ${routeName}`)
                }
            }
        }
    }
}