const db = require('../configs/db')

class recipeModel {
    static dashboards(userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.id, rp.photo_url AS recipe_photo, r.title AS recipe_name, u.username AS creator_name, COUNT(t.id) AS total_testimonials, CASE WHEN f.id IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS is_saved FROM recipes r LEFT JOIN recipe_photos rp ON r.id = rp.recipe_id JOIN users u ON r.user_id = u.id LEFT JOIN testimonials t ON r.id = t.recipe_id LEFT JOIN favorites f ON r.id = f.recipe_id AND f.user_id = ? GROUP BY r.id, rp.photo_url, r.title, u.username, f.id ORDER BY RAND()`, [userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getRecipeById(recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`select * from recipes where id = ?`, [recipeId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getRecipeByTitle(userId, title) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, r.title, u.nickname, COUNT(t.id) AS total_testimonials FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN testimonials t ON t.recipe_id = r.id WHERE r.user_id != ? AND r.title COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', ?, '%') GROUP BY r.id ORDER BY r.id DESC`, [userId, title], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }
}

module.exports = recipeModel