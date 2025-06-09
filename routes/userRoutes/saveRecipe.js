var express = require('express')
var router = express.Router()
const favoriteModel = require('../../models/favoriteModel')
const recipeModel = require('../../models/recipeModel')
const userModel = require('../../models/userModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/user/favorite_recipe', verifyToken, authorize(['user']), async (req, res, next) => {
    const userId = req.user.id

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        let rows = await favoriteModel.getFavoriteRecipeById(userId)

        res.status(200).json(rows)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.post('/user/save_recipe/:recipeId', verifyToken, authorize(['user']), async (req, res, next) => {
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

        const checkStatusRecipe = await recipeModel.getRecipeById(recipeId)
        if (checkStatusRecipe[0].status != 'approved') {
            return res.status(403).json({ message: 'Recipe Is private'})
        }

        const checkOwnerRecipe = await recipeModel.getTitleByRecipeAndUser(recipeId, userId)
        if (checkOwnerRecipe.length > 0) {
            return res.status(403).json({ message: 'cant save own recipe'})
        }

        await favoriteModel.createFavorite(userId, recipeId)

        res.status(200).json({message: 'OK'})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.delete('/user/save_recipe/:recipeId', verifyToken, authorize(['user']), async (req, res, next) => {
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

        await favoriteModel.deleteFavorite(userId, recipeId)

        res.status(200).json({message: 'OK'})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
