var express = require('express')
var router = express.Router()
const recipeModel = require('../../models/recipeModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/admin/recipes_approved/:recipeId', verifyToken, authorize(['admin']), async (req, res, next) => {
    const {recipeId} = req.params
    try {
        const statusRecipe = await recipeModel.getRecipeById(recipeId)
        if (statusRecipe[0].status != 'approved') return res.status(403).json({ message: 'Recipe status is not publish'})
        
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
        const statusRecipe = await recipeModel.getRecipeById(recipeId)
        if (statusRecipe[0].status == 'approved') return res.status(403).json({ message: 'Recipe status is publish'})
        
        const detailRecipe = await recipeModel.getDetailRecipeProcessById(recipeId)
        res.status(200).json({detailRecipe})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.patch('/admin/recipes_processing/:recipeId', verifyToken, authorize(['admin']), async (req, res, next) => {
    const adminId = req.user.id
    const {recipeId} = req.params
    const {status, adminComment} = req.body
    try {
        const statusRecipe = await recipeModel.getRecipeById(recipeId)
        if (statusRecipe[0].status == 'approved') return res.status(403).json({ message: 'Recipe status is publish'})
        
        if (status != 'approved' && status != 'rejected') return res.status(403).json({ message: 'Canot udapte status.'})
        
        await recipeModel.updateStatusRecipe(status, adminComment, adminId, recipeId)
        res.status(200).json({ message: 'OK'})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
