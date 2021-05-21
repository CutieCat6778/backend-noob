const express = require("express");
const routers = new express.Router();

module.exports = (io) => {
    routers.get('/', (req, res, next) => {
        if(req.user){
            res.render('index', {user: req.user, location: req.query.location});
        }else {
            res.render('not_loged_in')
        }
    })

    return routers
}
