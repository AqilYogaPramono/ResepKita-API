var express = require('express')
var router = express.Router()
const userModel = require('../../models/userModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')
const { cacheMiddleware, myCache } = require('../../middlewares/nodeCache')

router.get('/user/profile/:profileId', verifyToken, authorize(['user']), cacheMiddleware, async (req, res, next) => {
    const userId = req.user.id
    const {profileId} = req.params

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        const profile = await userModel.profileUserById(profileId)
        const recipePublishToOwner = await userModel.recipePublishToOwner(profileId)
        const recipeUnPublishToOwner = await userModel.recipeUnPublishToOwner(profileId)
        const recipePublishToUser = await userModel.recipePublishToUser(profileId)
        if (profileId == userId) {
            responseObject ={profile, recipePublishToOwner, recipeUnPublishToOwner}
        } else if (profileId != userId) {
            responseObject ={profile, recipePublishToUser}
        }

        if (req.cacheHit && req.cachedData) {
            return res.status(200).json({...req.cachedData, cache: 'Cache use' })
        }

        const respon = { ...responseObject, cache: 'Cache not use' }
        myCache.set(req.originalUrl, respon)
        res.status(200).json(respon)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
