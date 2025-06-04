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
        db.query(`SELECT r.id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, r.title, u.nickname, COUNT(t.id) AS total_testimonials, CASE WHEN f.user_id IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END AS is_saved FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN testimonials t ON t.recipe_id = r.id LEFT JOIN favorites f ON f.recipe_id = r.id WHERE r.status = 'approved' AND r.user_id != ? AND r.title COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', ?, '%') GROUP BY r.id, r.title, u.nickname, f.user_id ORDER BY r.id DESC`, [userId, title], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getTitleByRecipeAndUser(recipeId,userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT r.title FROM recipes AS r WHERE r.id = ? AND r.user_id = ?`, [recipeId, userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getDetailRecipeById(userId, recipeId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT r.id AS recipe_id, u.username AS recipe_creator_username, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', rp.photo_url, '"') ORDER BY rp.id), ']') AS recipe_photo, r.title AS recipe_name, r.description AS recipe_bio, r.cooking_time, r.portion AS total_portions, ( SELECT JSON_ARRAYAGG(ing.name) FROM ingredients AS ing WHERE ing.recipe_id = r.id ) AS ingredients, ( SELECT JSON_ARRAYAGG( JSON_OBJECT( 'introduction', ins.step_description, 'instruction_photos', ( SELECT JSON_ARRAYAGG(ip.photo_url) FROM instruction_photos AS ip WHERE ip.instruction_id = ins.id ) ) ) FROM instructions AS ins WHERE ins.recipe_id = r.id ) AS all_instructions, CASE WHEN EXISTS (SELECT 1 FROM favorites WHERE user_id = ? AND recipe_id = r.id) THEN 'TRUE' ELSE 'FALSE' END AS is_save FROM recipes AS r JOIN users AS u ON r.user_id = u.id LEFT JOIN recipe_photos AS rp ON r.id = rp.recipe_id WHERE r.id = ? AND r.status = 'approved' GROUP BY r.id, u.username, r.title, r.description, r.cooking_time, r.portion`, [userId, recipeId], (err, results) => {
                if (err) return reject(err)
                const formattedResults = results.map(row => ({
                    ...row,
                    recipe_photo: JSON.parse(row.recipe_photo || '[]'),
                    ingredients: JSON.parse(row.ingredients || '[]'),
                    all_instructions: JSON.parse(row.all_instructions || '[]')
                }))
                resolve(formattedResults)
            })
        })
    }

    static checkOwnerRecipe(userId, recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT CASE WHEN r.user_id = ? THEN 'TRUE' ELSE 'FALSE' END AS is_owner FROM recipes AS r WHERE r.id = ?`, [userId, recipeId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static checkCanTestimoni(userId, recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT CASE WHEN EXISTS (SELECT 1 FROM testimonials WHERE user_id = ? AND recipe_id = r.id) THEN 'FALSE' ELSE 'TRUE' END AS can_testimoni FROM recipes AS r WHERE r.id = ?`, [userId, recipeId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static getTetstimonial(recipeId, userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(t.id) OVER() AS total_testimonials_count, u.photo_profile, u.username, t.comment FROM testimonials AS t JOIN users AS u ON t.user_id = u.id WHERE t.recipe_id = ? AND t.user_id != ? ORDER BY RAND() LIMIT 3`, [recipeId, userId], (err, results) => {
            if (err) return reject(err)
            resolve(results)
        })
        })
    }

    static createRecipe(userId, title, description, portion, cookingTime, status, ingredients, instructions, recipePhotos, instructionPhotos) {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO recipes (user_id, title, description, portion, cooking_time, status) VALUES (?, ?, ?, ?, ?, ?)`, [userId, title, description, portion, cookingTime, status],
                (err, recipeResult) => {
                    if (err) return reject(err)

                    const recipeId = recipeResult.insertId

                    for (const item of ingredients) {
                        db.query(`INSERT INTO ingredients (recipe_id, name) VALUES (?, ?)`, [recipeId, item], () => {})
                    }

                    for (let i = 0; i < instructions.length; i++) {
                        db.query(`INSERT INTO instructions (recipe_id, step_description) VALUES (?, ?)`, [recipeId, instructions[i]],
                            (err, instructionResult) => {
                                if (instructionPhotos[i]) {
                                    db.query(`INSERT INTO instruction_photos (instruction_id, photo_url) VALUES (?, ?)`, [instructionResult.insertId, instructionPhotos[i]], () => {}
                                )
                            }
                        }
                    )
                }

                for (const photo of recipePhotos) {
                    db.query(`INSERT INTO recipe_photos (recipe_id, photo_url) VALUES (?, ?)`, [recipeId, photo], () => {})
                }

                resolve()
            }
        )
    })
}

    static updateRecipe(recipeId, title, description, portion, cookingTime, status, ingredients, instructions, recipePhotos, instructionPhotos) {
        return new Promise((resolve, reject) => {

            db.query(`UPDATE recipes SET title = ?, description = ?, portion = ?, cooking_time = ?, status = ? WHERE id = ?`, [title, description, portion, cookingTime, status, recipeId],
                (err, result) => {
                    if (err) return reject(err)

                    db.query(`DELETE FROM ingredients WHERE recipe_id = ?`, [recipeId], (err) => {
                        if (err) console.error('Error deleting ingredients:', err)
                    })
                    db.query(`DELETE FROM instructions WHERE recipe_id = ?`, [recipeId], (err) => {
                        if (err) console.error('Error deleting instructions:', err)
                    })
                    db.query(`DELETE FROM recipe_photos WHERE recipe_id = ?`, [recipeId], (err) => {
                        if (err) console.error('Error deleting recipe photos:', err)
                    })

                    for (const item of ingredients) {
                        db.query(`INSERT INTO ingredients (recipe_id, name) VALUES (?, ?)`, [recipeId, item], (err) => {
                            if (err) console.error('Error inserting ingredient:', err)
                        })
                    }

                    for (let i = 0; i < instructions.length; i++) {
                        db.query(`INSERT INTO instructions (recipe_id, step_description) VALUES (?, ?)`,[recipeId, instructions[i]],
                            (err, instructionResult) => {
                                if (err) {
                                    console.error('Error inserting instruction:', err)
                                    return
                                }
                                if (instructionPhotos[i]) {
                                    db.query(`INSERT INTO instruction_photos (instruction_id, photo_url) VALUES (?, ?)`, [instructionResult.insertId, instructionPhotos[i]],
                                        (err) => {
                                            if (err) console.error('Error inserting instruction photo:', err)
                                        }
                                    )
                                }
                            }
                        )
                    }

                    for (const photo of recipePhotos) {
                        db.query(`INSERT INTO recipe_photos (recipe_id, photo_url) VALUES (?, ?)`, [recipeId, photo],
                            (err) => {
                                if (err) console.error('Error inserting recipe photo:', err)
                            }
                        )
                    }
                    resolve()
                }
            )
        })
    }

    static getRecipeByIdAndUser(recipeId, userId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM recipes WHERE id = ? AND user_id = ?`,[recipeId, userId],
            (err, rows) => {
                if (err) return reject(err)
                if (rows.length > 0) resolve(rows[0])
                else resolve(null)
            }
        )
    })
}

    static getRecipePhotos(recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT photo_url FROM recipe_photos WHERE recipe_id = ?`, [recipeId],
            (err, rows) => {
                if (err) return reject(err)
                resolve(rows)
            }
        )
    })
}

    static getInstructionPhotos(recipeId) {
        return new Promise((resolve, reject) => {
        db.query(`SELECT ip.photo_url FROM instruction_photos ip JOIN instructions i ON ip.instruction_id = i.id WHERE i.recipe_id = ?`, [recipeId], (err, rows) => {
            if (err) return reject(err)
            resolve(rows)
        })
    })
}

}

module.exports = recipeModel