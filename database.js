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
}).promise();

async function getUsers() {
    const users = pool.query('select * from users');
    const [result] = await users;
    return result;
}

async function getCatalog() {
    const catalog = pool.query('select * from catalog');
    const [result] = await catalog;
    return result;
}

async function getItem(accession) {
    const item = pool.query('select * from catalog where accession = ?', accession);
    const [result] = await item;
    return result[0];
}

async function getUserLoans() {
    const items = pool.query('select loans.user_id, loans.checkout_date, loans.return_date, catalog.title, catalog.author from loans inner join catalog on loans.accession = catalog.accession');
    const [result] = await items;
    return result;
    items.array.forEach(element => {
        
    });
}


module.exports = {pool, getUsers, getCatalog, getItem, getUserLoans};
