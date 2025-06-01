const db = require('../configs/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class userModel {
    static registerUser(photoProfile, username, nickname, email, password) {
        return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const sql = `INSERT INTO users (photo_profile, username, nickname, email, password)
                        VALUES (?, ?, ?, ?, ?)`
            db.query(
            sql,
            [photoProfile, username, nickname, email, hashedPassword],
            (err, results) => {
                if (err) return reject(err)
                resolve(results.insertId)
            }
            )
        } catch (error) {
            reject(error)
        }
        })
    }

    static getByUsername(username) {
        return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?'
        db.query(sql, [username], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getByEmail(email) {
        return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?'
        db.query(sql, [email], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static async login(email, password) {
        return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?'
        db.query(sql, [email], async (err, results) => {
            if (err) return reject({ status: 500, message: err.message })
            if (results.length === 0) return resolve(null)
            const user = results[0]
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch)
            return reject({ status: 401, message: 'Wrong password.' })
            const token = jwt.sign(
            { id: user.id, role: 'user', email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1000d' }
            )
            resolve({ token })
        })
        })
    }

    static getUserById(userId) {
        return new Promise((resolve, reject) => {
        db.query(`select * from users where id = ?`, [userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static profileUserById(userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT u.photo_profile, u.username, u.nickname, u.bio, ( SELECT COUNT(*) FROM testimonials t WHERE t.user_id = u.id ) AS total_testimonials, ( SELECT COUNT(*) FROM recipes r WHERE r.user_id = u.id AND r.status = 'approved' ) AS total_recipes_published FROM users u WHERE u.id = ?`, [userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }
}

module.exports = userModel