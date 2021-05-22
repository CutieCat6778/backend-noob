const express = require("express");
const routers = new express.Router();
const fetch = require('node-fetch');

routers.get('/', (req, res, next) => {
    if (req.user) {
        fetch(process.env.hook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "content": `**${req.user.username}#${req.user.discriminator}** (${req.user.discordId})\n Loged in!` })
        });
        res.render('index', { user: req.user, location: req.query.location });
    } else {
        res.render('not_loged_in')
    }
})

routers.get('/invite', (req, res, next) => {
    res.redirect('https://discord.gg/3Ssz6cKTS5');
})

module.exports = routers