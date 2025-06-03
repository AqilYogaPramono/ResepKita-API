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
}

module.exports = testimonialModel