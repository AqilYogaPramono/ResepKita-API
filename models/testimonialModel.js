const db = require('../configs/db')

class testimonialModel {
static createTestimoni(userId, recipeId, comment, testimonialPhotos) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO testimonials (user_id, recipe_id, comment) VALUES (?, ?, ?)`,
            [userId, recipeId, comment],
            (err, testimonialResult) => {
                if (err) return reject(err)

                const testimonialId = testimonialResult.insertId

                const inserts = testimonialPhotos.map(photoUrl => {
                    return new Promise((res, rej) => {
                        db.query(
                            `INSERT INTO testimonial_photos (testimonial_id, photo_url) VALUES (?, ?)`,
                            [testimonialId, photoUrl],
                            (err, results) => {
                                if (err) return rej(err)
                                res(results)
                            }
                        )
                    })
                })

                Promise.all(inserts)
                    .then(() => resolve({ testimonialId, photoCount: testimonialPhotos.length }))
                    .catch(reject)
            }
        )
    })
}

    static checkTetimoni(userId, recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM testimonials WHERE user_id = ? AND recipe_id = ?`, [userId, recipeId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getTestimoniByUserId(recipeId, userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT u.id AS user_id, u.nickname AS testimonial_creator_username, u.photo_profile, t.comment AS testimonial_text, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', tp.photo_url, '"') ORDER BY tp.id), ']') AS testimonial_photos FROM testimonials AS t JOIN users AS u ON t.user_id = u.id LEFT JOIN testimonial_photos AS tp ON t.id = tp.testimonial_id WHERE t.recipe_id = ? AND t.user_id = ? GROUP BY t.id, u.id, u.nickname, u.photo_profile, t.comment`, [recipeId, userId], (err, results) => {
            if (err) return reject(err)
            const formattedResults = results.map(row => ({
                ...row,
                testimonial_photos: JSON.parse(row.testimonial_photos || '[]')
            }))
            resolve(formattedResults)
        })
        })
    }

    static getAllTestimoni(recipeId, userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT u.id AS user_id, u.nickname AS testimonial_creator_username, u.photo_profile, t.comment AS testimonial_text, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', tp.photo_url, '"') ORDER BY tp.id), ']') AS testimonial_photos FROM testimonials AS t JOIN users AS u ON t.user_id = u.id LEFT JOIN testimonial_photos AS tp ON t.id = tp.testimonial_id WHERE t.recipe_id = ? AND t.user_id != ? GROUP BY t.id, u.id, u.nickname, u.photo_profile, t.comment`, [recipeId, userId], (err, results) => {
            if (err) return reject(err)
            const formattedResults = results.map(row => ({
                ...row,
                testimonial_photos: JSON.parse(row.testimonial_photos || '[]')
            }))
            resolve(formattedResults)
        })
        })
    }

    static countTestimoniByIdRecipe(recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) AS total_testimonials FROM testimonials WHERE recipe_id = ?`, [recipeId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }
}

module.exports = testimonialModel