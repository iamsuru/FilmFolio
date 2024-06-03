const jwt = require('jsonwebtoken')

require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '24h' });
}
module.exports = { generateToken }  