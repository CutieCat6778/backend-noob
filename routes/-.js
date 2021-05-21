const express = require("express");
const routers = new express.Router();

routers.get('/', (req, res, next) => {
    if(req.user){
        res.render('dash', {user: req.user});
    }else {
        res.render('not_loged_in')
    }
})

module.exports = routers;