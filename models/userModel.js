const db = require('../configs/db')

class userModel {
static getUserByUserName(email) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT username FROM users WHERE email = ?`, [email], (err, results) => {
            if (err) return reject(err)
            resolve(results[0]);
        })
    })
}

}

module.exports = userModel