const db = require('../configs/db')
const bcrypt = require('bcryptjs')

class userModel {
    static async registerUser(photoProfile, username, nickname, email, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const sql = `INSERT INTO users (photo_profile, username, nickname, email, password) VALUES (?, ?, ?, ?, ?)`
            const [results] = await db.query(sql, [photoProfile, username, nickname, email, hashedPassword])
            return results.insertId
        } catch (error) {
            throw error
        }
    }

    static async getByUsername(username) {
        try {
            const sql = 'SELECT * FROM users WHERE username = ?'
            const [results] = await db.query(sql, [username])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getByEmail(email) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?'
            const [results] = await db.query(sql, [email])
            return results
        } catch (err) {
            throw err
        }
    }


    static async getUserById(userId) {
        try {
            const [results] = await db.query(`select * from users where id = ?`, [userId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async profileUserById(profileId) {
        try {
            const [results] = await db.query(`SELECT u.id, u.photo_profile, u.username, u.nickname, u.bio, ( SELECT COUNT(*) FROM testimonials t JOIN recipes r ON t.recipe_id = r.id WHERE r.user_id = u.id ) AS total_testimonials, ( SELECT COUNT(*) FROM recipes r WHERE r.user_id = u.id AND r.status = 'approved' ) AS total_recipes_published FROM users u WHERE u.id = ?`, [profileId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async recipeProcess(profileId) {
        try {
            const [results] = await db.query(`SELECT r.id AS recipe_id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, u.id AS user_id, u.nickname, u.photo_profile, r.title AS recipe_name FROM recipes r JOIN users u ON r.user_id = u.id WHERE r.status = 'process' AND r.user_id = ? ORDER BY r.id DESC`, [profileId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async recipeReject(profileId) {
        try {
            const [results] = await db.query(`SELECT r.id AS recipe_id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, u.id AS user_id, u.nickname, u.photo_profile, r.title AS recipe_name FROM recipes r JOIN users u ON r.user_id = u.id WHERE r.status = 'rejected' AND r.user_id = ? ORDER BY r.id DESC`, [profileId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async recipePublish(userId, profileId) {
        try {
            const [results] = await db.query(`SELECT r.id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, u.id AS user_id, u.nickname, u.photo_profile, r.title, COUNT(t.id) AS total_testimonials, IF(f.recipe_id IS NOT NULL, 'true', 'false') AS is_saved FROM recipes AS r JOIN users AS u ON r.user_id = u.id LEFT JOIN testimonials AS t ON t.recipe_id = r.id LEFT JOIN favorites AS f ON f.recipe_id = r.id AND f.user_id = ? WHERE r.status = 'approved' AND r.user_id = ? GROUP BY r.id, u.id, u.nickname, u.photo_profile, r.title, f.recipe_id ORDER BY r.id DESC`, [userId, profileId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async updateProfile(username, nickname, profile_photo, bio, userId) {
        try {
            const [results] = await db.query(`UPDATE users SET username = ?, nickname = ?, photo_profile = ?, bio = ? WHERE id = ?`, [username, nickname, profile_photo, bio, userId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getByUsernameToUpdate(username, userId){
        try {
            const [results] = await db.query(`SELECT username FROM users WHERE username = ? AND id != ?`, [username, userId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getByEmailToUpdate(newEmail, userId) {
        try {
            const [results] = await db.query(`SELECT email FROM users WHERE username = ? AND id != ?`, [newEmail, userId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async updateEmailProfile(newEmail, userId) {
        try {
            const [results] = await db.query(`UPDATE users SET email = ? WHERE id = ?`, [newEmail, userId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async updatePasswordProfile(newPassword, userId) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            const [results] = await db.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getUserTotestimoni(userId) {
        try {
            const [results] = await db.query(`SELECT username, photo_profile FROM users WHERE id = ?;`, [userId])
            return results
        } catch (err) {
            throw err
        }
    }
}

module.exports = userModel