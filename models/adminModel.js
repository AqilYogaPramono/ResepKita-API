const db = require('../configs/db')
const jwt = require('jsonwebtoken')

class adminModel {
    static async login(email, password) {
        try {
            const sql = 'SELECT * FROM admins WHERE email = ?'
            const [results] = await db.query(sql, [email])
            if (results.length === 0) return null
            const admin = results[0]
            if (admin.password !== password) throw { status: 401, message: 'Wrong password.' }
            const token = jwt.sign(
                { id: admin.id, role: 'admin', email: admin.email },
                process.env.JWT_SECRET,
                { expiresIn: '1000d' }
            )
            return { token }
        } catch (err) {
            throw err
        }
    }

    static async getUsernameAdmin(adminId) {
        try {
            const [results] = await db.query(`SELECT username FROM admins WHERE id = ?`, [adminId])
            return results
        } catch (err) {
            throw err
        }
    }
}

module.exports = adminModel