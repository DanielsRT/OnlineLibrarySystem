if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME,
    connectionLimit: 20
});

module.exports = pool;