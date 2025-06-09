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

    static profileUserById(profileId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT u.photo_profile, u.username, u.nickname, u.bio, ( SELECT COUNT(*) FROM testimonials t JOIN recipes r ON t.recipe_id = r.id WHERE r.user_id = u.id ) AS total_testimonials, ( SELECT COUNT(*) FROM recipes r WHERE r.user_id = u.id AND r.status = 'approved' ) AS total_recipes_published FROM users u WHERE u.id = ?`, [profileId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static recipeProcess(profileId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.id AS recipe_id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, u.id AS user_id, u.nickname, u.photo_profile, r.title AS recipe_name FROM recipes r JOIN users u ON r.user_id = u.id WHERE r.status = 'process' AND r.user_id = ? ORDER BY r.id DESC`, [profileId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static recipeReject(profileId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.id AS recipe_id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, u.id AS user_id, u.nickname, u.photo_profile, r.title AS recipe_name FROM recipes r JOIN users u ON r.user_id = u.id WHERE r.status = 'rejected' AND r.user_id = ? ORDER BY r.id DESC`, [profileId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static recipePublish(profileId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, u.id AS user_id, u.nickname, u.photo_profile, r.title, COUNT(t.id) AS total_testimonials, IF(f.recipe_id IS NOT NULL, 'true', 'false') AS is_saved FROM recipes AS r JOIN users AS u ON r.user_id = u.id LEFT JOIN testimonials AS t ON t.recipe_id = r.id LEFT JOIN favorites AS f ON f.recipe_id = r.id AND f.user_id = ? WHERE r.status = 'approved' AND r.user_id = ? GROUP BY r.id, u.id, u.nickname, u.photo_profile, r.title, f.recipe_id ORDER BY r.id DESC`, [profileId, profileId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static updateProfile(username, nickname, profile_photo, bio, userId) {
        return new Promise((resolve, reject) => {
        db.query(`UPDATE users SET username = ?, nickname = ?, photo_profile = ?, bio = ? WHERE id = ?`, [username, nickname, profile_photo, bio, userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getByUsernameToUpdate(username, userId){
        return new Promise((resolve, reject) => {
        db.query(`SELECT username FROM users WHERE username = ? AND id != ?`, [username, userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getByEmailToUpdate(newEmail, userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT email FROM users WHERE username = ? AND id != ?`, [newEmail, userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static updateEmailProfile(newEmail, userId) {
        return new Promise((resolve, reject) => {
        db.query(`UPDATE users SET email = ? WHERE id = ?`, [newEmail, userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static updatePasswordProfile (newPassword, userId) {
        return new Promise(async(resolve, reject) => {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        db.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getUserTotestimoni(userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT username, photo_profile FROM users WHERE id = ?;`, [userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }
}

module.exports = userModel