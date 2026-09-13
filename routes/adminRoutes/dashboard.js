const express = require('express')
const router = express.Router()
const recipeModel = require('../../models/recipeModel')
const adminModel = require('../../models/adminModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

router.get('/admin/dashboard', verifyToken, authorize(['admin']), async (req, res) => {
    try {
        const adminId = req.user.id
        const respon = await recipeModel.dashboardsAdmin()
        const admin = await adminModel.getUsernameAdmin(adminId)
        res.status(200).json({ admin, respon })
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(err)
    }
})

module.exports = router
