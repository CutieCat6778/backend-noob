const router = require('express').Router();
const passport = require('passport');

module.exports = (io) => {
    router.get('/discord', passport.authenticate('discord'));

    router.get('/discord/redirect', passport.authenticate('discord'), (req, res, next) => {
        io.sockets.emit('client_loged_in', req.user);
        res.redirect('/')
    })
    
    router.get('/', (req, res, next) => {
        if(req.user && req.user == "762749432658788384"){
            res.send(req.user)
        }else {
            res.redirect('/api/auth/discord');
        }
    })
    return router;
}