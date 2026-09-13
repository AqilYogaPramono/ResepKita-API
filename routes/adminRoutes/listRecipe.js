const express = require('express')
const router = express.Router()
const recipeModel = require('../../models/recipeModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/admin/recipes_approved', verifyToken, authorize(['admin']), async (req, res) => {
    try {
        const respon = await recipeModel.getRecipeApproved()

        res.status(200).json(respon)
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(err)
    }
})

router.get('/admin/recipes_processing', verifyToken, authorize(['admin']), async (req, res) => {
    try {
        const respon = await recipeModel.getRecipeprocess()

        res.status(200).json(respon)
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(err)
    }
})

module.exports = router
