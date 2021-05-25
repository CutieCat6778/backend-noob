const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const Oauth2 = require('../database/schemas/OAuth2Credentials');
const { decrypt } = require('./utils');

async function getUserGuilds(discordId){
    const credentials = await Oauth2.findOne({discordId: discordId});
    if(!credentials) throw new Error('No Credentials found!');
    const encryptedAccessToken = credentials.get('accessToken');
    const decrypted = decrypt(encryptedAccessToken);
    const accessToken = decrypted.toString(CryptoJS.enc.Utf8);
    const res = await fetch(`${process.env.DISCORD_API}/users/@me/guilds`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return res.json();
}

async function getMe(discordId){
    const credentials = await Oauth2.findOne({discordId: discordId});
    if(!credentials) throw new Error('No Credentials found!');
    const encryptedAccessToken = credentials.get('accessToken');
    const decrypted = decrypt(encryptedAccessToken);
    const accessToken = decrypted.toString(CryptoJS.enc.Utf8);
    const res = await fetch(`${process.env.DISCORD_API}/users/@me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return res.json();
}

async function getUser(discordId, targetId){
    const credentials = await Oauth2.findOne({discordId: discordId});
    if(!credentials) throw new Error('No Credentials found!');
    const encryptedAccessToken = credentials.get('accessToken');
    const decrypted = decrypt(encryptedAccessToken);
    const accessToken = decrypted.toString(CryptoJS.enc.Utf8);
    const res = await fetch(`${process.env.DISCORD_API}/users/${targetId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return res.json();
}

module.exports = { getUserGuilds, getMe, getUser}