const db = require('../configs/db')

class favoriteModel {
    static async getFavoriteRecipeById(userId) {
        try {
            const [results] = await db.query(`SELECT r.id, r.title, (SELECT rp.photo_url FROM recipe_photos AS rp WHERE rp.recipe_id = r.id LIMIT 1) AS photo_url, u.id AS user_id, u.nickname, u.photo_profile, COUNT(t.id) AS total_testimonials, CASE WHEN f.id IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS is_saved FROM favorites AS f JOIN recipes AS r ON f.recipe_id = r.id JOIN users AS u ON r.user_id = u.id LEFT JOIN testimonials AS t ON r.id = t.recipe_id WHERE f.user_id = ? GROUP BY r.id, r.title, u.id, u.nickname, u.photo_profile, f.id ORDER BY r.id DESC`, [userId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getFavorite(userId, recipeId) {
        try {
            const [results] = await db.query(`SELECT user_id, recipe_id FROM favorites WHERE user_id = ? AND recipe_id = ?`, [userId, recipeId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async createFavorite(userId, recipeId) {
        try {
            const [results] = await db.query(`INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)`, [userId, recipeId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async deleteFavorite(userId, recipeId) {
        try {
            const [results] = await db.query(`DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?`, [userId, recipeId])
            return results
        } catch (err) {
            throw err
        }
    }
}

module.exports = favoriteModel