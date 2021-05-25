const routers = require('express').Router();
const Users = require('../../database/schemas/Users');

routers.get('/location', (req, res, next) => {
    if (!req.user) return res.status(401).send({msg: "Unauthorized!"});
    else if (req.user) {
        Users.findOne({ discordId: req.user.discordId }).then(async dataFetched => {
            if (!dataFetched) return res.status(401).send({msg: "Unauthorized!"});
            const data = require('../../utils/tools/locationConvert')(req.query.location);
            dataFetched.location = {
                country: data[0] ? data[0] : data[1],
                location: data[0] ? data[1] : null,
                location_id: data[2]
            }
            await dataFetched.save();
            return res.status(200);
        }).catch(e => {
            console.error(e);
            return res.status(401).send({msg: "Unauthorized"});
        })
    }
})

routers.get('/location/datas', (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Access denied!" });
    else if (req.user) {
        return res.status(200).json({ data: req.user.location });
    }
})

routers.get('/countries/:type/:country', async(req, res, next) => {
    if(req.params.type == "id"){
        const users = await Users.find({'location.location_id': req.params.country})
        return res.status(200).json(users);
    }else if(req.params.type == "name"){
        const users = await Users.find({'location.country': req.params.country})
        return res.status(200).json(users);
    }else if(req.params.type == "states"){
        const users = await Users.find({'location.location': req.params.country})
        return res.status(200).json(users);
    }else return next('Invalid value of type!');
})

module.exports = routers