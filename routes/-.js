const express = require("express");
const routers = new express.Router();

routers.get('/', (req, res, next) => {
    if (req.user) {
        res.render('index', { user: req.user, location: req.query.location });
    } else {
        res.render('not_loged_in')
    }
})

routers.get('/invite', (req, res, next) => {
    res.redirect('https://discord.gg/3Ssz6cKTS5');
})

module.exports = routers