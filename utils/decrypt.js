const crypto = require('crypto');

const KEY = Buffer.from('0123456789abcdef', 'utf8');
const IV = Buffer.from('abcdef0123456789', 'utf8');

exports.encrypt = (plaintext) => {
    if (!plaintext) {
        return '';
    }
    const cipher = crypto.createCipheriv('aes-128-cbc', KEY, IV);
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

exports.decrypt = (ciphertext) => {
    if (!ciphertext) {
        return '';
    }
    const decipher = crypto.createDecipheriv('aes-128-cbc', KEY, IV);
    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}