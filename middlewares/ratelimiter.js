const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 7 * 60 * 1000,
    max: 3,
    keyGenerator: (req, res) => req.ip,
    message: 'Terlalu banyak permintaan. Coba 7 menit lagi...',
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = limiter