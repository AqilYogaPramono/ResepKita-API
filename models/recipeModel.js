const db = require('../configs/db')

class recipeModel {
static dashboards(userId) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT r.id, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', rp.photo_url, '"') ORDER BY rp.id), ']') AS recipe_photo, r.title, u.username, COUNT(DISTINCT t.id) AS total_testimonials, CASE WHEN f.user_id IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS is_saved FROM recipes AS r LEFT JOIN recipe_photos AS rp ON r.id = rp.recipe_id JOIN users AS u ON r.user_id = u.id LEFT JOIN testimonials AS t ON r.id = t.recipe_id LEFT JOIN favorites AS f ON r.id = f.recipe_id WHERE r.status = 'approved' AND r.user_id != ? GROUP BY r.id, r.title, u.username, f.user_id ORDER BY RAND()`, [userId], (err, results) => {
            if (err) return reject(err)
            const formattedResults = results.map(row => ({
                ...row,
                recipe_photo: JSON.parse(row.recipe_photo || '[]')
            }))
            resolve(formattedResults)
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