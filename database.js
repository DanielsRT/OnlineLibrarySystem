require('dotenv').config;
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'library_database',
    connectionLimit: 20
});

module.exports = pool;
