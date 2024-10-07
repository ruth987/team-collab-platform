const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to the database');
        const res = await client.query('SELECT NOW()');
        console.log('Current time from database:', res.rows[0].now);
        client.release();
    } catch (err) {
        console.error('Error connecting to the database', err.stack);
    }
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    testConnection
}