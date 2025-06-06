const db = require('../configs/db')

class favoriteModel {
    static getFavoriteRecipeById(userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.id, r.title, (SELECT rp.photo_url FROM recipe_photos rp WHERE rp.recipe_id = r.id LIMIT 1) AS photo_url, u.username, COUNT(t.id) AS total_testimonials, CASE WHEN f.id IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS is_saved FROM favorites f JOIN recipes r ON f.recipe_id = r.id LEFT JOIN recipe_photos rp ON r.id = rp.recipe_id JOIN users u ON r.user_id = u.id LEFT JOIN testimonials t ON r.id = t.recipe_id WHERE f.user_id = ? GROUP BY r.id, r.title, rp.photo_url, u.username, f.id`, [userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getFavorite(userId, recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT user_id, recipe_id FROM favorites WHERE user_id = ? AND recipe_id = ?`, [userId, recipeId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static createFavorite(userId, recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)`, [userId, recipeId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static deleteFavorite(userId, recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?`, [userId, recipeId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }
}

module.exports = favoriteModel