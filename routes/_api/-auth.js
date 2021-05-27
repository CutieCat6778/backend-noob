const router = require('express').Router();
const passport = require('passport');

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/redirect', passport.authenticate('discord'), (req, res, next) => {
    res.redirect(`${process.env.URL}dashboard`)
})

router.get('/', (req, res, next) => {
    if (req.user) {
        if(req.user.guild == "MongooseDocument { null }") return res.status(401).json({msg: "Guild not found!"});
        else return res.json(req.user)
    } else {
        res.status(401).send({msg: "Unauthorized!"});
    }
})

router.get('/logout', (req, res, next) => {
    if(!req.user) return res.status(401).send({msg: "Unauthorized!"});
    else if(req.user){
        try{
            req.logOut();
            req.session.destroy(function (err) {
                res.statusCode(200)
            });
        }catch(e){
            res.status(502).send({msg: e.toString()})
        }
    }
})

module.exports = router;