var express = require('express')
var router = express.Router()
const recipeModel = require('../../models/recipeModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/admin/recipes_approved', verifyToken, authorize(['admin']), async (req, res, next) => {
    try {
        const respon = await recipeModel.getRecipeApproved()

        res.status(200).json(respon)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.get('/admin/recipes_processing', verifyToken, authorize(['admin']), async (req, res, next) => {
    try {
        const respon = await recipeModel.getRecipeprocess()

        res.status(200).json(respon)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
