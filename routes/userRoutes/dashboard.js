var express = require('express')
var router = express.Router()
const recipeModel = require('../../models/recipeModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/user/dashboard', verifyToken, authorize(['user']), async (req, res, next) => {
    const userId = req.user.id

    try {
        let rows = await recipeModel.dashboards(userId)
        res.status(200).json(rows)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
