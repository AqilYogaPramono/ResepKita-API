var express = require('express')
var router = express.Router()
const favoriteModel = require('../../models/favoriteModel')
const recipeModel = require('../../models/recipeModel')
const userModel = require('../../models/userModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')
const { cacheMiddleware, myCache } = require('../../middlewares/nodeCache')
const { changeUser } = require('../../configs/db')

router.get('/user/favorite_recipe', verifyToken, authorize(['user']), cacheMiddleware, async (req, res, next) => {
    const userId = req.user.id

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        if (req.cacheHit && req.cachedData) {
            return res.status(200).json({...req.cachedData, cache: 'Cache use' })
        }

        let rows = await favoriteModel.getFavoriteRecipeById(userId)
        const respon = { rows, cache: 'Cache not use' }
        myCache.set(req.originalUrl, respon)
        res.status(200).json(respon)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.post('/user/save_recipe/:recipeId', verifyToken, authorize(['user']), cacheMiddleware, async (req, res, next) => {
    const userId = req.user.id
    const {recipeId} = req.params

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        const checkRecipeId = await recipeModel.getRecipeById(recipeId)
        if (checkRecipeId.length == 0) {
            return res.status(403).json({ message: 'Recipe not found'})
        }

        const checkFavorite = await favoriteModel.getFavorite(userId, recipeId)
        if (checkFavorite.length > 0) {
            return res.status(403).json({ message: 'Recipe already favorite'})
        }

        if (req.cacheHit && req.cachedData) {
            return res.status(200).json({...req.cachedData, cache: 'Cache use' })
        }

        await favoriteModel.createFavorite(userId, recipeId)
        const responsePayload = { message: 'OK', cache: 'Cache not used' }

        myCache.set(req.originalUrl, responsePayload)
        res.status(200).json({responsePayload})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.delete('/user/save_recipe/:recipeId', verifyToken, authorize(['user']), cacheMiddleware, async (req, res, next) => {
    const userId = req.user.id
    const {recipeId} = req.params

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        const checkRecipeId = await recipeModel.getRecipeById(recipeId)
        if (checkRecipeId.length == 0) {
            return res.status(403).json({ message: 'Recipe not found'})
        }

        if (req.cacheHit && req.cachedData) {
            return res.status(200).json({...req.cachedData, cache: 'Cache use' })
        }

        await favoriteModel.deleteFavorite(userId, recipeId)
        const responsePayload = { message: 'OK', cache: 'Cache not used' }

        myCache.set(req.originalUrl, responsePayload)
        res.status(200).json({responsePayload})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
