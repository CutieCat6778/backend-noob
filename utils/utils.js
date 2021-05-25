const CryptoJs = require('crypto-js');

function encrypt(token){
    return CryptoJs.AES.encrypt(token, process.env.SECRET_PASS);
}

function decrypt(token) {
    return CryptoJs.AES.decrypt(token, process.env.SECRET_PASS);
}

module.exports = {encrypt, decrypt};