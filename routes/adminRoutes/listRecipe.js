var express = require('express')
var router = express.Router()
const { verifyToken, authorize } = require('../../middlewares/jwt')
const { cacheMiddleware, myCache } = require('../../middlewares/nodeCache')

router.get('/admin/', verifyToken, authorize(['admin']), cacheMiddleware, async (req, res, next) => {
    try {

        res.status(200).json(respon)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
