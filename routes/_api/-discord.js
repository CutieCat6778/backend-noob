const routers = require('express').Router();
const {getUserGuilds, getUser, getMe} = require('../../utils/api');

routers.get('/guilds', async(req, res) => {
    if(req.user){
        const data = await getUserGuilds(req.user.discordId);
        return res.send(data);
    }else return res.status(401).send({msg: "Unauthorized!"});
})

routers.get('/user', async(req, res) => {
    if(req.user){
        const data = await getMe(req.user.discordId);
        return res.send(data);
    }else return res.status(401).send({msg: "Unauthorized!"});
})

routers.get('/user/:id', async(req, res) => {
    if(req.user){
        const data = await getUser(req.user.discordId, req.params.id);
        console.log(data);
        return res.send(data);
    }else return res.status(401).send({msg: "Unauthorized!"});
})

module.exports = routers;