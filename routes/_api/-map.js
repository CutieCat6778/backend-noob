const routers = require('express').Router();
const Users = require('../../database/schemas/Users');
const fetch = require('node-fetch')

routers.get('/location', (req, res, next) => {
    console.log(req.user, req.query)
    if (!req.user) return res.redirect('/api/auth/discord');
    else if (req.user) {
        Users.findOne({ discordId: req.user.discordId }).then(async dataFetched => {
            console.log(dataFetched);
            if (!dataFetched) return res.redirect('/api/auth/discord');
            dataFetched.location = req.query.location;
            await dataFetched.save();
            console.log(dataFetched);
            fetch(process.env.hook, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "content": `**${req.user.username}#${req.user.discriminator}** (${req.user.discordId})\n ${req.query.location}` })
            });
            return res.redirect('/');
        }).catch(e => {
            console.log(e);
            return next('502: Can\'t not fetch data from Database <br> ' + e.toString())
        })
    }
})

routers.get('/location/datas', (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Access denied!" });
    else if (req.user) {
        console.log(req.user)

        console.log({ data: req.user.location })
        return res.status(200).json({ data: req.user.location });
    }
})

module.exports = routers