const passport = require("passport");
const DiscordStrategy = require('passport-discord');
const User = require('../database/schemas/Users');
const fetch = require('node-fetch');
const Oauth2 = require('../database/schemas/OAuth2Credentials');
const { encrypt } = require("../utils/utils");

passport.serializeUser((user, done) => {
    done(null, user.discordId);
})

passport.deserializeUser(async (discordId, done) => {
    try {
        const user = await User.findOne({ discordId });
        return user ? done(null, user) : done(null, null);
    } catch (e) {
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

    const { id, username, discriminator, avatar, guilds } = profile;
    try {
        const findUser = await User.findOne({ discordId: id });
        const encryptedAccessToken = encrypt(accessToken).toString();
        const encryptedRefreshToken = encrypt(refeshToken).toString();
        if (findUser) {
            await findUser.updateOne({
                discriminator,
                avatar,
                username,
                location: typeof (findUser.location) == "object" ? findUser.location : null,
            }, { new: true })
            const findCredentials = await Oauth2.findOne({ discordId: id });
            findCredentials.accessToken = encryptedAccessToken;
            findCredentials.refreshToken = encryptedRefreshToken;
            await findCredentials.save();
            return done(null, findUser);
        } else if (!findUser) {
            const newUser = await User.create({
                discordId: id,
                discriminator: discriminator,
                avatar,
                location: {
                    country: null,
                    location: null,
                    location_id: null
                },
                username,
            });
            const newCredentials = await Oauth2.create({
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                discordId: id
            })
            fetch(process.env.hook, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "content": `**${username}#${discriminator}** (${id})\n New Account created!` })
            });
            return done(null, newUser);
        }
    } catch (e) {
        console.error(e);
        return done(e, null);
    }
}))