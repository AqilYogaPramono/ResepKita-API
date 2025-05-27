const db = require('../configs/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class userModel {
    static registerUser(photoProfile, username, nickname, email, password) {
        return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = `INSERT INTO users (photo_profile, username, nickname, email, password)
                        VALUES (?, ?, ?, ?, ?)`;
            db.query(
            sql,
            [photoProfile, username, nickname, email, hashedPassword],
            (err, results) => {
                if (err) return reject(err);
                resolve(results.insertId);
            }
            );
        } catch (error) {
            reject(error);
        }
        });
    }

    static getByUsername(username) {
        return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
        });
    }

    static getByEmail(email) {
        return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
        });
    }
}

module.exports = userModel;