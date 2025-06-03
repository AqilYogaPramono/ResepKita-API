var express = require('express')
var router = express.Router()
const recipeModel = require('../../models/recipeModel')
const userModel = require('../../models/userModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/user/:recipeId/detail_recipe', verifyToken, authorize(['user']), async (req, res, next) => {
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
        

        const detailRecipe = await recipeModel.getDetailRecipeById(userId, userId, recipeId)
        const checkOwnerRecipe = await recipeModel.checkOwnerRecipe(userId, recipeId)
        const checkCanTestimoni = await recipeModel.checkCanTestimoni(userId, recipeId)
        const testimonials = await recipeModel.getTetstimonial(recipeId, userId)
        res.status(200).json({detailRecipe, testimonials, checkOwnerRecipe, checkCanTestimoni})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
