const db = require('../configs/db')

class favoriteModel {
    static getFavoriteRecipeById(userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.id, r.title, (SELECT rp.photo_url FROM recipe_photos AS rp WHERE rp.recipe_id = r.id LIMIT 1) AS photo_url, u.id AS user_id, u.nickname, u.photo_profile, COUNT(t.id) AS total_testimonials, CASE WHEN f.id IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS is_saved FROM favorites AS f JOIN recipes AS r ON f.recipe_id = r.id JOIN users AS u ON r.user_id = u.id LEFT JOIN testimonials AS t ON r.id = t.recipe_id WHERE f.user_id = ? GROUP BY r.id, r.title, u.id, u.nickname, u.photo_profile, f.id ORDER BY r.id DESC`, [userId], (err, results) => {
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