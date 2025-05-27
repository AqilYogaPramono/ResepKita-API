const db = require('../configs/db')
const jwt = require('jsonwebtoken')

class adminModel {
    static async login(email, password) {
        return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM admins WHERE email = ?'
        db.query(sql, [email], (err, results) => {
            if (err) return reject({ status: 500, message: err.message })
            if (results.length === 0) return resolve(null)
            const admin = results[0]
            if (admin.password !== password)
            return reject({ status: 401, message: 'Wrong password.' })
            const token = jwt.sign(
            { id: admin.id, role: 'admin', email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '1000d' }
            )
            resolve({ token })
        })
        })
    }
}

module.exports = adminModel