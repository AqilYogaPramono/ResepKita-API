var express = require('express')
var router = express.Router()
const recipeModel = require('../../models/recipeModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/admin/dashboard', verifyToken, authorize(['admin']), async (req, res, next) => {
    try {
        const respon = await recipeModel.dashboardsAdmin()

        res.status(200).json(respon)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
