const passport = require("passport");
const DiscordStrategy = require('passport-discord');
const User = require('../database/schemas/Users');
const fetch = require('node-fetch');

passport.serializeUser((user, done) => {
    done(null, user.discordId);
})

passport.deserializeUser(async(discordId, done) => {
    try{
        const user = await User.findOne({discordId});
        return user ? done(null, user) : done(null, null);
    }catch(e){
        console.error(e);
        return done(e, null);
    }
})

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, async (accessToken, refeshToken, profile, done) => {
    const {id, username, discriminator, avatar, guilds } = profile;
    try{
        if(!guilds.find(a => a.id == "721203266452586507")) return done(null, null);
        const findUser = await User.findOne({discordId: id});
        if(findUser){
            await findUser.updateOne({
                discriminator,
                avatar,
                username
            }, {new: true})
            return done(null, findUser);
        } else if(!findUser){
            const newUser = await User.create({
                discordId: id,
                discriminator: discriminator,
                avatar,
                location: null,
                username
            });
            fetch(process.env.hook, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "content": `**${username}#${discriminator}** (${id})\n New Account created!` })
            });
            return done(null, newUser);
        }
    }catch(e){
        console.error(e);
        return done(e, null);
    }
}))