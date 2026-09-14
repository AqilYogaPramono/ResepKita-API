const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const recipeModel = require('../../models/recipeModel')
const userModel = require('../../models/userModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')
const { parseJsonFields } = require('../../middlewares/jsonParser')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname == 'recipePhotos') {
            cb(null, path.join(__dirname, '../../public/images/recipe'))
        } else if (file.fieldname == 'instructionPhotos') {
            cb(null, path.join(__dirname, '../../public/images/intruction'))
        } else {
            cb(new Error('Invalid field name'), null)
        }
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

const uploadFields = upload.fields([
    { name: 'recipePhotos' },
    { name: 'instructionPhotos' }
])

const deleteUploadedFiles = (files) => {
    if (!files) return
    const allFiles = [...(files.recipePhotos || []), ...(files.instructionPhotos || [])]
    allFiles.forEach(file => {
        const photoPath =
            file.fieldname == 'recipePhotos'
                ? path.join(__dirname, '../../public/images/recipe', file.filename)
                : path.join(__dirname, '../../public/images/intruction', file.filename)
        if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath)
    })
}

const deleteOldPhoto = (oldPhoto) => {
    if (oldPhoto) {
        const filePath = path.join(__dirname, '../../public/images/recipe', oldPhoto)
        const filePath1 = path.join(__dirname, '../../public/images/intruction', oldPhoto)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        if (fs.existsSync(filePath1)) fs.unlinkSync(filePath1)
    }
}

router.get('/user/:recipeId/detail_recipe', verifyToken, authorize(['user']), async (req, res) => {
    try {
        const userId = req.user.id
        const { recipeId } = req.params
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        const checkRecipeId = await recipeModel.getRecipeById(recipeId)
        if (checkRecipeId.length == 0) {
            return res.status(403).json({ message: 'Recipe not found' })
        }

        const detailRecipe = await recipeModel.getDetailRecipeById(userId, recipeId)
        const checkOwnerRecipe = await recipeModel.checkOwnerRecipe(userId, recipeId)
        const checkCanTestimoni = await recipeModel.checkCanTestimoni(userId, recipeId)
        const testimonials = await recipeModel.getTetstimonial(recipeId, userId)
        res.status(200).json({ detailRecipe, testimonials, checkOwnerRecipe, checkCanTestimoni })
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(e)
    }
})

router.post('/user/create_recipe', verifyToken, authorize(['user']), uploadFields, parseJsonFields(['ingredients', 'instructions', 'newInstructionPhotoCounts']), async (req, res) => {
    try {
        const userId = req.user.id
        const { title, description, portion, cookingTime, status, ingredients, instructions, newInstructionPhotoCounts } = req.body

        const userCheck = await userModel.getUserById(userId)
        if (userCheck.length == 0) {
            deleteUploadedFiles(req.files)
            return res.status(404).json({ message: 'User not found' })
        }

        const recipePhotos = req.files?.recipePhotos ? req.files.recipePhotos.map(file => file.filename) : []
        if (recipePhotos.length > 3) {
            deleteUploadedFiles(req.files)
            return res.status(400).json({ message: 'Maximum 3 recipe photos are allowed.' })
        }

        if (status !== 'process' && status !== 'rejected') {
            deleteUploadedFiles(req.files)
            return res.status(400).json({ message: 'Please check status' })
        }

        const newInstructionPhotos = req.files?.instructionPhotos ? req.files.instructionPhotos.map(file => file.filename) : []
        let photoIdx = 0
        for (let i = 0; i < instructions.length; i++) {
            const count = newInstructionPhotoCounts[i] || 0
            const newPhotosForStep = newInstructionPhotos.slice(photoIdx, photoIdx + count)
            photoIdx += count
            instructions[i].photos = [...newPhotosForStep]
        }

        await recipeModel.createRecipe(userId, title, description, portion, cookingTime, status, ingredients, instructions, recipePhotos)

        res.status(201).json({ message: 'OK' })
    } catch (error) {
        deleteUploadedFiles(req.files)
        res.status(500).json({ message: "Internal Server Error" })
        console.log(error)
    }
})

router.patch('/user/edit_recipe/:recipeId', verifyToken, authorize(['user']), uploadFields, parseJsonFields(['ingredients', 'instructions', 'oldRecipePhotos', 'oldInstructionPhotos', 'newInstructionPhotoCounts']), async (req, res) => {
    try {
        const { recipeId } = req.params
        const userId = req.user.id
        const { title, description, portion, cookingTime, status, ingredients, instructions, oldRecipePhotos, oldInstructionPhotos, newInstructionPhotoCounts } = req.body

        const recipeData = await recipeModel.getRecipeByIdAndUser(recipeId, userId)
        if (!recipeData) {
            deleteUploadedFiles(req.files)
            return res.status(404).json({ message: 'Recipe not found' })
        }

        const allOldRecipePhotos = await recipeModel.getRecipePhotos(recipeId)
        const allOldInstructionPhotos = await recipeModel.getInstructionPhotos(recipeId)

        allOldRecipePhotos.forEach(row => {
            if (!oldRecipePhotos.includes(row.photo_url)) {
                deleteOldPhoto(row.photo_url)
            }
        })

        allOldInstructionPhotos.forEach(row => {
            if (!oldInstructionPhotos.includes(row.photo_url)) {
                deleteOldPhoto(row.photo_url)
            }
        })

        const newRecipePhotos = req.files?.recipePhotos ? req.files.recipePhotos.map(file => file.filename) : []
        const finalRecipePhotos = [...oldRecipePhotos, ...newRecipePhotos]

        const newInstructionPhotos = req.files?.instructionPhotos ? req.files.instructionPhotos.map(file => file.filename) : []
        let photoIdx = 0
        for (let i = 0; i < instructions.length; i++) {
            const count = newInstructionPhotoCounts[i] || 0
            const newPhotosForStep = newInstructionPhotos.slice(photoIdx, photoIdx + count)
            photoIdx += count
            instructions[i].photos = [...(instructions[i].photos || []), ...newPhotosForStep]
        }

        if (finalRecipePhotos.length > 3) {
            deleteUploadedFiles(req.files)
            return res.status(400).json({ message: 'Maximum 3 recipe photos are allowed.' })
        }

        if (status !== 'process' && status !== 'rejected') {
            deleteUploadedFiles(req.files)
            return res.status(400).json({ message: 'Invalid status' })
        }

        await recipeModel.updateRecipe(recipeId, title, description, portion, cookingTime, status, ingredients, instructions, finalRecipePhotos, oldInstructionPhotos)

        res.status(200).json({ message: 'OK' })
    } catch (error) {
        deleteUploadedFiles(req.files)
        res.status(500).json({ message: "Internal Server Error" })
        console.log(error)
    }
})

router.get('/user/edit_recipe/:recipeId', verifyToken, authorize(['user']), async (req, res) => {
    try {
        const userId = req.user.id
        const { recipeId } = req.params
        const checkRecipeId = await recipeModel.getRecipeById(recipeId)
        if (checkRecipeId.length == 0) {
            return res.status(403).json({ message: 'Recipe not found' })
        }

        const adminComment = await recipeModel.getAdminCommentByIdRecipe(recipeId)
        res.status(200).json({ adminComment })
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" })
        console.log(e)
    }
})

module.exports = router
