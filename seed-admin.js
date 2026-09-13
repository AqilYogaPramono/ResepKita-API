require('dotenv').config()
const db = require('./configs/db')
const bcrypt = require('bcryptjs')

async function seedAdmin() {
    try {
        const [rows] = await db.query(`SELECT id FROM admins WHERE email = ?`, [process.env.EMAIL_ADMIN])
        if (rows.length > 0) {
            console.log('Admin sudah ditambahkan sebelumnya.')
        } else {
            const hashedPassword = bcrypt.hashSync(process.env.PASSWORD_ADMIN, 10)
            await db.query(`INSERT INTO admins (username, email, password) VALUES (?, ?, ?)`, [process.env.USERNAME_ADMIN, process.env.EMAIL_ADMIN, hashedPassword])
            console.log('Akun Admin berhasil ditambahkan.')
        }
    } catch (err) {
        console.error(err)
    } finally {
        process.exit()
    }
}

seedAdmin()
