require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    database: process.env.DATABASE
}