var express = require('express')
var router = express.Router()
const recipeModel = require('../../models/recipeModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/admin/recipes_approved/:recipeId', verifyToken, authorize(['admin']), async (req, res, next) => {
    const {recipeId} = req.params
    try {
        const detailRecipe = await recipeModel.getDetailRecipeApprovedById(recipeId)
        const adminComment = await recipeModel.getAdminCommentByIdRecipe(recipeId)
        res.status(200).json({detailRecipe, adminComment})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.get('/admin/recipes_processing/:recipeId', verifyToken, authorize(['admin']), async (req, res, next) => {
    const {recipeId} = req.params
    try {
        const detailRecipe = await recipeModel.getDetailRecipeApprovedById(recipeId)
        res.status(200).json({detailRecipe})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
