const router = require('express').Router();
const passport = require('passport');

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res, next) => {
    if (!req.user) res.defirect('/invite');
    
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