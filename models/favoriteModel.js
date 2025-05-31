const db = require('../configs/db')

class favoriteModel {
    static getFavoriteRecipeById(userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.id, r.title, rp.photo_url, u.username, COUNT(t.id) AS total_testimonials, CASE WHEN f.id IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS is_saved FROM favorites f JOIN recipes r ON f.recipe_id = r.id LEFT JOIN recipe_photos rp ON r.id = rp.recipe_id JOIN users u ON r.user_id = u.id LEFT JOIN testimonials t ON r.id = t.recipe_id WHERE f.user_id = ? GROUP BY r.id, r.title, rp.photo_url, u.username, f.id`, [userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }
}

module.exports = favoriteModel