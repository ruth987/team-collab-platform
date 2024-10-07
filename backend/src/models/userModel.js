const db = require('../config/db');
const bcrypt = require('bcryptjs');

const userModel = {
    async create(name, email, password, profilePicture = null, role = 'member') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (name, email, password, profile_picture, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email
        `;
        const values = [name, email, hashedPassword, profilePicture, role];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async findByEmail(email) {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await db.query(query, [email]);
        return result.rows[0];
    },

    async findById(id) {
        const query = "SELECT * FROM users WHERE id = $1";
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

}

module.exports = userModel;
