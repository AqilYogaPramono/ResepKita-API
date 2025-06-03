var express = require('express')
var router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const userModel = require('../../models/userModel')
const recipeModel = require('../../models/recipeModel')
const testimonialModel = require('../../models/testimonialModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images/testimonials'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/
        const mimetype = allowedTypes.test(file.mimetype)
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        if (mimetype && extname) {
            cb(null, true)
        } else {
            cb(new Error('Only image files (jpeg, jpg, png) are allowed'))
        }
    }
})

const deleteUploadedFiles = (files) => {
    if (files && files.length > 0) {
        files.forEach(file => {
            const filePath = path.join(__dirname, '../../public/images/testimonials', file.filename)
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        })
    }
}

router.get('/user/create_testimoni', verifyToken, authorize(['user']), async (req, res, next) => {
    const userId = req.user.id
    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        const respon = await userModel.getUserTotestimoni(userId)

        res.status(200).json(respon)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.post('/user/:recipeId/create_testimoni', verifyToken, authorize(['user']), upload.array('testimonialPhotos'), async (req, res, next) => {
    const userId = req.user.id
    const { recipeId } = req.params
    const { comment } = req.body
    
    try {
        if (req.files.length == 0) {
            return res.status(400).json({ message: 'Testimonial photos are required.' })
        }
        
        const testimonialPhotos = req.files.map(file => file.filename)
        
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            deleteUploadedFiles(req.files)
            return res.status(404).json({ message: 'User not found' })
        }
        
        const checkRecipeId = await recipeModel.getRecipeById(recipeId)
        if (checkRecipeId.length == 0) {
            deleteUploadedFiles(req.files)
            return res.status(403).json({ message: 'Recipe not found' })
        }

        const checkTetimoni = await testimonialModel.checkTetimoni(userId, recipeId)
        if (checkTetimoni.length > 0) {
            deleteUploadedFiles(req.files)
            return res.status(403).json({ message: 'User already created testimonial' })
        }

        if (testimonialPhotos.length > 3) {
            deleteUploadedFiles(req.files)
            return res.status(403).json({ message: 'Maximum 3 testimonial photos are allowed.' })
        }

        await testimonialModel.createTestimoni(userId, recipeId, comment, testimonialPhotos)

        res.status(200).json({ message: 'OK' })
    } catch (e) {
        deleteUploadedFiles(req.files)
        res.status(500).json({ message: e.message })
    }
})

router.get('/user/:recipeId/testimoni', verifyToken, authorize(['user']), async (req, res, next) => {
    const userId = req.user.id
    const { recipeId } = req.params

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        const checkRecipeId = await recipeModel.getRecipeById(recipeId)
        if (checkRecipeId.length == 0) {
            deleteUploadedFiles(req.files)
            return res.status(403).json({ message: 'Recipe not found' })
        }

        const getTestimoniByUser = await testimonialModel.getTestimoniByUserId(recipeId, userId)
        const getAllTestimoni = await testimonialModel.getAllTestimoni(recipeId, userId)

        res.status(200).json({getTestimoniByUser, getAllTestimoni})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
