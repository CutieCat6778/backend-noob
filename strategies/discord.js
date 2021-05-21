const passport = require("passport");
const DiscordStrategy = require('passport-discord');
const User = require('../database/schemas/Users');

passport.serializeUser((user, done) => {
    done(null, user.discordId);
})

passport.deserializeUser(async(discordId, done) => {
    try{
        const user = await User.findOne({discordId});
        return user ? done(null, user) : done(null, null);
    }catch(e){
        console.log(e);
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
        const findUser = await User.findOne({discordId: id});
        if(findUser){
            console.log('User was found!');
            await findUser.updateOne({
                discriminator,
                avatar,
                username
            }, {new: true})
            return done(null, findUser);
        } else if(!findUser){
            console.log('User was not found!');
            const newUser = await User.create({
                discordId: id,
                discriminator: discriminator,
                avatar,
                location: null,
                username
            });
            return done(null, newUser);
        }
    }catch(e){
        console.log(e);
        return done(e, null);
    }
}))