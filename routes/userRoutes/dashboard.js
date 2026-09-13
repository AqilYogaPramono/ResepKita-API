const express = require('express')
const router = express.Router()
const recipeModel = require('../../models/recipeModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/user/dashboard', verifyToken, authorize(['user']), async (req, res) => {
    try {
        const userId = req.user.id

        let rows = await recipeModel.dashboards(userId)
        res.status(200).json(rows)
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(e)
    }
})

module.exports = router
