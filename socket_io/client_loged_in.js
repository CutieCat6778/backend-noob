const fetch = require('node-fetch')

module.exports = (client, socket) => {
    fetch(process.env.chicken_api+"user_auth", {
        method: "post",
        body: JSON.stringify(client),
        headers: { "Content-Type": "application/json" }
    })
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
        .catch(e => {
            socket.emit('server_error', e);
        })
}