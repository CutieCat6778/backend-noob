const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    discriminator: {
        type: String,
        required: true,
        unique: false
    },
    avatar: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: false,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: false
    }
})

module.exports = mongoose.model('User', UserSchema);