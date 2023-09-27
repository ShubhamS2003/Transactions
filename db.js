const Pool = require('pg').Pool;
 
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'transactions',
    password: 'new_password',
    dialect: 'postgres',
    port: 5432
});

module.exports = pool;