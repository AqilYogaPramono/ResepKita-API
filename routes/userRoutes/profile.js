var express = require('express')
var router = express.Router()
const userModel = require('../../models/userModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')
const { cacheMiddleware, myCache } = require('../../middlewares/nodeCache')

router.get('/user/profile', verifyToken, authorize(['user']), cacheMiddleware, async (req, res, next) => {
    const userId = req.user.id

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        if (req.cacheHit && req.cachedData) {
            return res.status(200).json({...req.cachedData, cache: 'Cache use' })
        }

        const rows = await userModel.profileUserById(userId) 
        const respon = { rows, cache: 'Cache not use' }
        myCache.set(req.originalUrl, respon)
        res.status(200).json(respon)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
