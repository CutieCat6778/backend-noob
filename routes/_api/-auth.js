const router = require('express').Router();
const passport = require('passport');

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res, next) => {
    res.redirect('/')
})

router.get('/', (req, res, next) => {
    if(req.user){
        res.send(req.user)
    }else {
        res.redirect('/api/auth/discord');
    }
})

module.exports = router;