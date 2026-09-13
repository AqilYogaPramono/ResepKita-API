var express = require('express')
var router = express.Router()
const recipeModel = require('../../models/recipeModel')
const adminModel = require('../../models/adminModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/admin/dashboard', verifyToken, authorize(['admin']), async (req, res, next) => {
    const adminId = req.user.id
    try {
        const respon = await recipeModel.dashboardsAdmin()
        const admin = await adminModel.getUsernameAdmin(adminId)
        res.status(200).json({ admin, respon })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
