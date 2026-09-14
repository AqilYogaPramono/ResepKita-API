const db = require('../configs/db')

class recipeModel {
    static async dashboards(userId) {
        try {
            const [results] = await db.query(`SELECT r.id, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', rp.photo_url, '"') ORDER BY rp.id), ']') AS recipe_photo, r.title, u.id AS user_id, u.nickname, u.photo_profile AS user_photo_profile, COUNT(DISTINCT t.id) AS total_testimonials, CASE WHEN f.user_id IS NOT NULL THEN 'true' ELSE 'false' END AS is_saved FROM recipes AS r LEFT JOIN recipe_photos AS rp ON r.id = rp.recipe_id JOIN users AS u ON r.user_id = u.id LEFT JOIN testimonials AS t ON r.id = t.recipe_id LEFT JOIN favorites AS f ON r.id = f.recipe_id AND f.user_id = ? WHERE r.status = 'approved' AND r.user_id <> ? GROUP BY r.id, u.id ORDER BY RAND()`, [userId, userId])
            return results.map(row => ({
                ...row,
                recipe_photo: JSON.parse(row.recipe_photo || '[]')
            }))
        } catch (err) {
            throw err
        }
    }

    static async getRecipeById(recipeId) {
        try {
            const [results] = await db.query(`select * from recipes where id = ?`, [recipeId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getRecipeByTitle(userId, title) {
        try {
            const [results] = await db.query(`SELECT r.id, (SELECT photo_url FROM recipe_photos WHERE recipe_id = r.id LIMIT 1) AS recipe_photo, r.title, u.id AS user_id, u.nickname, u.photo_profile, COUNT(t.id) AS total_testimonials, CASE WHEN f.user_id IS NOT NULL THEN 'true' ELSE 'false' END AS is_saved FROM recipes AS r JOIN users AS u ON r.user_id = u.id LEFT JOIN testimonials AS t ON t.recipe_id = r.id LEFT JOIN favorites AS f ON f.recipe_id = r.id AND f.user_id = ? WHERE r.status = 'approved' AND r.user_id <> ? AND r.title COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', ?, '%') GROUP BY r.id, u.id ORDER BY r.id DESC`, [userId, userId, title])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getTitleByRecipeAndUser(recipeId, userId) {
        try {
            const [results] = await db.query(`SELECT r.title FROM recipes AS r WHERE r.id = ? AND r.user_id = ?`, [recipeId, userId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getDetailRecipeById(userId, recipeId) {
        try {
            const [results] = await db.query(`SELECT r.id AS recipe_id, u.id AS user_id, u.nickname AS recipe_creator_username, u.photo_profile, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', rp.photo_url, '"') ORDER BY rp.id), ']') AS recipe_photo, r.title AS recipe_name, r.description AS recipe_bio, r.cooking_time, r.portion AS total_portions, (SELECT JSON_ARRAYAGG(ing.name) FROM ingredients AS ing WHERE ing.recipe_id = r.id) AS ingredients, (SELECT JSON_ARRAYAGG(JSON_OBJECT('introduction', ins.step_description, 'instruction_photos', (SELECT JSON_ARRAYAGG(ip.photo_url) FROM instruction_photos AS ip WHERE ip.instruction_id = ins.id))) FROM instructions AS ins WHERE ins.recipe_id = r.id) AS all_instructions, CASE WHEN EXISTS (SELECT 1 FROM favorites WHERE user_id = ? AND recipe_id = r.id) THEN 'TRUE' ELSE 'FALSE' END AS is_save, (SELECT COUNT(*) FROM testimonials WHERE recipe_id = r.id) AS total_testimonials FROM recipes AS r JOIN users AS u ON r.user_id = u.id LEFT JOIN recipe_photos AS rp ON r.id = rp.recipe_id WHERE r.id = ? GROUP BY r.id, u.id, u.nickname, u.photo_profile, r.title, r.description, r.cooking_time, r.portion`, [userId, recipeId])
            return results.map(row => ({
                ...row,
                recipe_photo: typeof row.recipe_photo === 'string' ? JSON.parse(row.recipe_photo || '[]') : (row.recipe_photo || []),
                ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients || '[]') : (row.ingredients || []),
                all_instructions: typeof row.all_instructions === 'string' ? JSON.parse(row.all_instructions || '[]') : (row.all_instructions || [])
            }))
        } catch (err) {
            throw err
        }
    }

    static async checkOwnerRecipe(userId, recipeId) {
        try {
            const [results] = await db.query(`SELECT CASE WHEN r.user_id = ? THEN 'TRUE' ELSE 'FALSE' END AS is_owner FROM recipes AS r WHERE r.id = ?`, [userId, recipeId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async checkCanTestimoni(userId, recipeId) {
        try {
            const [results] = await db.query(`SELECT CASE WHEN EXISTS (SELECT 1 FROM testimonials WHERE user_id = ? AND recipe_id = r.id) THEN 'FALSE' ELSE 'TRUE' END AS can_testimoni FROM recipes AS r WHERE r.id = ?`, [userId, recipeId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async getTetstimonial(recipeId, userId) {
        try {
            const [results] = await db.query(`SELECT u.id AS user_id, u.nickname, u.photo_profile, t.comment, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', tp.photo_url, '"')), ']') AS photo_testimonial FROM testimonials AS t JOIN users AS u ON t.user_id = u.id LEFT JOIN testimonial_photos AS tp ON t.id = tp.testimonial_id WHERE t.recipe_id = ? AND t.user_id != ? GROUP BY t.id, u.id, u.nickname, u.photo_profile, t.comment ORDER BY RAND() LIMIT 3`, [recipeId, userId])
            return results.map(row => ({
                ...row,
                photo_testimonial: JSON.parse(row.photo_testimonial || '[]')
            }))
        } catch (err) {
            throw err
        }
    }

    static async createRecipe(userId, title, description, portion, cookingTime, status, ingredients, instructions, recipePhotos) {
        const connection = await db.getConnection()
        try {
            await connection.beginTransaction()

            const [recipeResult] = await connection.query(`INSERT INTO recipes (user_id, title, description, portion, cooking_time, status) VALUES (?, ?, ?, ?, ?, ?)`, [userId, title, description, portion, cookingTime, status])
            const recipeId = recipeResult.insertId

            if (Array.isArray(ingredients)) {
                for (const item of ingredients) {
                    await connection.query(`INSERT INTO ingredients (recipe_id, name) VALUES (?, ?)`, [recipeId, item])
                }
            }

            if (Array.isArray(instructions)) {
                for (let i = 0; i < instructions.length; i++) {
                    const desc = instructions[i].desc || instructions[i]
                    const [instructionResult] = await connection.query(`INSERT INTO instructions (recipe_id, step_description) VALUES (?, ?)`, [recipeId, desc])
                    if (instructions[i].photos && Array.isArray(instructions[i].photos)) {
                        for (const photo of instructions[i].photos) {
                            await connection.query(`INSERT INTO instruction_photos (instruction_id, photo_url) VALUES (?, ?)`, [instructionResult.insertId, photo])
                        }
                    }
                }
            }

            if (Array.isArray(recipePhotos)) {
                for (const photo of recipePhotos) {
                    await connection.query(`INSERT INTO recipe_photos (recipe_id, photo_url) VALUES (?, ?)`, [recipeId, photo])
                }
            }

            await connection.commit()
            return recipeId
        } catch (err) {
            await connection.rollback()
            throw err
        } finally {
            connection.release()
        }
    }

    static async updateRecipe(recipeId, title, description, portion, cookingTime, status, ingredients, instructions, recipePhotos, oldInstructionPhotos) {
        const connection = await db.getConnection()
        try {
            await connection.beginTransaction()

            await connection.query(`UPDATE recipes SET title = ?, description = ?, portion = ?, cooking_time = ?, status = ? WHERE id = ?`, [title, description, portion, cookingTime, status, recipeId])

            await connection.query(`DELETE FROM ingredients WHERE recipe_id = ?`, [recipeId])
            await connection.query(`DELETE FROM instructions WHERE recipe_id = ?`, [recipeId])
            await connection.query(`DELETE FROM recipe_photos WHERE recipe_id = ?`, [recipeId])

            if (Array.isArray(ingredients)) {
                for (const item of ingredients) {
                    await connection.query(`INSERT INTO ingredients (recipe_id, name) VALUES (?, ?)`, [recipeId, item])
                }
            }

            if (Array.isArray(instructions)) {
                for (let i = 0; i < instructions.length; i++) {
                    const desc = instructions[i].desc || instructions[i]
                    const [instructionResult] = await connection.query(`INSERT INTO instructions (recipe_id, step_description) VALUES (?, ?)`, [recipeId, desc])
                    if (instructions[i].photos && Array.isArray(instructions[i].photos)) {
                        for (const photo of instructions[i].photos) {
                            await connection.query(`INSERT INTO instruction_photos (instruction_id, photo_url) VALUES (?, ?)`, [instructionResult.insertId, photo])
                        }
                    }
                }
            }

            if (Array.isArray(recipePhotos)) {
                for (const photo of recipePhotos) {
                    await connection.query(`INSERT INTO recipe_photos (recipe_id, photo_url) VALUES (?, ?)`, [recipeId, photo])
                }
            }

            await connection.commit()
        } catch (err) {
            await connection.rollback()
            throw err
        } finally {
            connection.release()
        }
    }

    static async getRecipeByIdAndUser(recipeId, userId) {
        try {
            const [rows] = await db.query(`SELECT * FROM recipes WHERE id = ? AND user_id = ?`, [recipeId, userId])
            return rows.length > 0 ? rows[0] : null
        } catch (err) {
            throw err
        }
    }

    static async getRecipePhotos(recipeId) {
        try {
            const [rows] = await db.query(`SELECT photo_url FROM recipe_photos WHERE recipe_id = ?`, [recipeId])
            return rows
        } catch (err) {
            throw err
        }
    }

    static async getInstructionPhotos(recipeId) {
        try {
            const [rows] = await db.query(`SELECT ip.photo_url FROM instruction_photos ip JOIN instructions i ON ip.instruction_id = i.id WHERE i.recipe_id = ?`, [recipeId])
            return rows
        } catch (err) {
            throw err
        }
    }

    static async dashboardsAdmin() {
        try {
            const [results] = await db.query(`SELECT (SELECT COUNT(*) FROM users) AS total_registered_users, (SELECT COUNT(*) FROM testimonials) AS total_testimonials, (SELECT COUNT(*) FROM recipes WHERE status = 'approved') AS total_approved_recipes, (SELECT COUNT(*) FROM recipes WHERE status = 'process') AS total_processing_recipes`)
            return results
        } catch (err) {
            throw err
        }
    }

    static async getRecipeApproved() {
        try {
            const [results] = await db.query(`SELECT r.id AS recipe_id, r.title AS recipe_name, u.username AS recipe_creator, a.username AS admin_name FROM recipes r LEFT JOIN users u ON r.user_id = u.id LEFT JOIN admins a ON r.admin_id = a.id WHERE r.status = 'approved' ORDER BY r.id DESC`)
            return results
        } catch (err) {
            throw err
        }
    }

    static async getRecipeprocess() {
        try {
            const [results] = await db.query(`SELECT r.id AS recipe_id, r.title AS recipe_name, u.username AS recipe_creator FROM recipes r LEFT JOIN users u ON r.user_id = u.id WHERE r.status = 'process' ORDER BY r.id DESC`)
            return results
        } catch (err) {
            throw err
        }
    }

    static async getDetailRecipeApprovedById(recipeId) {
        try {
            const [results] = await db.query(`SELECT r.id AS recipe_id, u.username AS recipe_creator_username, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', rp.photo_url, '"') ORDER BY rp.id), ']') AS recipe_photo, r.title AS recipe_name, r.description AS recipe_bio, r.cooking_time, r.portion AS total_portions, ( SELECT JSON_ARRAYAGG(ing.name) FROM ingredients AS ing WHERE ing.recipe_id = r.id ) AS ingredients, ( SELECT JSON_ARRAYAGG( JSON_OBJECT( 'introduction', ins.step_description, 'instruction_photos', ( SELECT JSON_ARRAYAGG(ip.photo_url) FROM instruction_photos AS ip WHERE ip.instruction_id = ins.id ) ) ) FROM instructions AS ins WHERE ins.recipe_id = r.id ) AS all_instructions FROM recipes AS r JOIN users AS u ON r.user_id = u.id LEFT JOIN recipe_photos AS rp ON r.id = rp.recipe_id WHERE r.id = ? AND r.status = 'approved' GROUP BY r.id, u.username, r.title, r.description, r.cooking_time, r.portion`, [recipeId])
            return results.map(row => ({
                ...row,
                recipe_photo: typeof row.recipe_photo === 'string' ? JSON.parse(row.recipe_photo || '[]') : (row.recipe_photo || []),
                ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients || '[]') : (row.ingredients || []),
                all_instructions: typeof row.all_instructions === 'string' ? JSON.parse(row.all_instructions || '[]') : (row.all_instructions || [])
            }))
        } catch (err) {
            throw err
        }
    }

    static async getDetailRecipeProcessById(recipeId) {
        try {
            const [results] = await db.query(`SELECT r.id AS recipe_id, u.username AS recipe_creator_username, CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', rp.photo_url, '"') ORDER BY rp.id), ']') AS recipe_photo, r.title AS recipe_name, r.description AS recipe_bio, r.cooking_time, r.portion AS total_portions, ( SELECT JSON_ARRAYAGG(ing.name) FROM ingredients AS ing WHERE ing.recipe_id = r.id ) AS ingredients, ( SELECT JSON_ARRAYAGG( JSON_OBJECT( 'introduction', ins.step_description, 'instruction_photos', ( SELECT JSON_ARRAYAGG(ip.photo_url) FROM instruction_photos AS ip WHERE ip.instruction_id = ins.id ) ) ) FROM instructions AS ins WHERE ins.recipe_id = r.id ) AS all_instructions FROM recipes AS r JOIN users AS u ON r.user_id = u.id LEFT JOIN recipe_photos AS rp ON r.id = rp.recipe_id WHERE r.id = ? AND r.status = 'process' GROUP BY r.id, u.username, r.title, r.description, r.cooking_time, r.portion`, [recipeId])
            return results.map(row => ({
                ...row,
                recipe_photo: typeof row.recipe_photo === 'string' ? JSON.parse(row.recipe_photo || '[]') : (row.recipe_photo || []),
                ingredients: typeof row.ingredients === 'string' ? JSON.parse(row.ingredients || '[]') : (row.ingredients || []),
                all_instructions: typeof row.all_instructions === 'string' ? JSON.parse(row.all_instructions || '[]') : (row.all_instructions || [])
            }))
        } catch (err) {
            throw err
        }
    }

    static async getAdminCommentByIdRecipe(recipeId) {
        try {
            const [results] = await db.query(`SELECT a.username AS admin_name, r.admin_comment AS admin_comment FROM recipes AS r LEFT JOIN admins AS a ON r.admin_id = a.id WHERE r.id = ?`, [recipeId])
            return results
        } catch (err) {
            throw err
        }
    }

    static async updateStatusRecipe(status, adminComment, adminId, recipeId) {
        try {
            const [results] = await db.query(`UPDATE recipes SET status = ?, admin_comment = ?, admin_id = ? WHERE id = ?; `, [status, adminComment, adminId, recipeId])
            return results
        } catch (err) {
            throw err
        }
    }
}

module.exports = recipeModel