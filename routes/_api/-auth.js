const router = require('express').Router();
const passport = require('passport');
const fetch = require('node-fetch');

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res, next) => {
    if (!req.user) res.defirect('/invite');
    fetch(process.env.hook, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "content": `**${req.user.username}#${req.user.discriminator}**\n Loged in!` })
    });
    res.redirect('/')
})

router.get('/', (req, res, next) => {
    if (req.user && req.user.discordId == "762749432658788384") {
        res.send(req.user)
    } else {
        res.redirect('/api/auth/discord');
    }
})
module.exports = router;