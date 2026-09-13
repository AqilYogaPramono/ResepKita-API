const db = require('../configs/db')

class adminModel {
    static async getByEmail(email) {
        try {
            const sql = 'SELECT * FROM admins WHERE email = ?'
            const [results] = await db.query(sql, [email])
            return results
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