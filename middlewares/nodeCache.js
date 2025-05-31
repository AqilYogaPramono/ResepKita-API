const NodeCache = require('node-cache')
const myCache = new NodeCache({ stdTTL: 60 })

function cacheMiddleware(req, res, next) {
    const key = req.originalUrl 
    const cachedData = myCache.get(key)
    if (cachedData) {
        req.cacheHit = true
        req.cachedData = cachedData
    } else {
        req.cacheHit = false
    }
    next()
}

module.exports = { cacheMiddleware, myCache }
