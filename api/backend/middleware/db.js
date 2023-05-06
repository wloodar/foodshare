const Pool = require('pg-pool');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'zsmeiehk',
    password: process.env.DB_PASS,
    port: '5432',
})

module.exports = pool;