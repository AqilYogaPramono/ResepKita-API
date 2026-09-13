const db = require('../configs/db')

class testimonialModel {
    static async createTestimoni(userId, recipeId, comment, testimonialPhotos) {
        try {
            const [testimonialResult] = await db.query(`INSERT INTO testimonials (user_id, recipe_id, comment) VALUES (?, ?, ?)`, [userId, recipeId, comment])
            const testimonialId = testimonialResult.insertId
            
            for (const photoUrl of testimonialPhotos) {
                await db.query(`INSERT INTO testimonial_photos (testimonial_id, photo_url) VALUES (?, ?)`, [testimonialId, photoUrl])
            }
            
            return { testimonialId, photoCount: testimonialPhotos.length }
        } catch (err) {
            throw err
        }
    }

    static async checkTetimoni(userId, recipeId) {
        try {
            const [results] = await db.query(`SELECT id FROM testimonials WHERE user_id = ? AND recipe_id = ?`, [userId, recipeId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getTestimoniByUserId(recipeId, userId) {
        try {
            const [results] = await db.query(`SELECT u.id AS user_id, u.nickname AS testimonial_creator_username, u.photo_profile, t.comment AS testimonial_text, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', tp.photo_url, '"') ORDER BY tp.id), ']') AS testimonial_photos FROM testimonials AS t JOIN users AS u ON t.user_id = u.id LEFT JOIN testimonial_photos AS tp ON t.id = tp.testimonial_id WHERE t.recipe_id = ? AND t.user_id = ? GROUP BY t.id, u.id, u.nickname, u.photo_profile, t.comment`, [recipeId, userId])
            return results.map(row => ({
                ...row,
                testimonial_photos: JSON.parse(row.testimonial_photos || '[]')
            }))
        } catch (err) {
            throw err
        }
    }

    static async getAllTestimoni(recipeId, userId) {
        try {
            const [results] = await db.query(`SELECT u.id AS user_id, u.nickname AS testimonial_creator_username, u.photo_profile, t.comment AS testimonial_text, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', tp.photo_url, '"') ORDER BY tp.id), ']') AS testimonial_photos FROM testimonials AS t JOIN users AS u ON t.user_id = u.id LEFT JOIN testimonial_photos AS tp ON t.id = tp.testimonial_id WHERE t.recipe_id = ? AND t.user_id != ? GROUP BY t.id, u.id, u.nickname, u.photo_profile, t.comment`, [recipeId, userId])
            return results.map(row => ({
                ...row,
                testimonial_photos: JSON.parse(row.testimonial_photos || '[]')
            }))
        } catch (err) {
            throw err
        }
    }

    static async countTestimoniByIdRecipe(recipeId) {
        try {
            const [results] = await db.query(`SELECT COUNT(*) AS total_testimonials FROM testimonials WHERE recipe_id = ?`, [recipeId])
            return results
        } catch (err) {
            throw err
        }
    }
}

module.exports = testimonialModel