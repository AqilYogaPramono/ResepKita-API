var express = require('express')
var router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const userModel = require('../../models/userModel')
const { verifyToken, authorize } = require('../../middlewares/jwt')
const { cacheMiddleware, myCache } = require('../../middlewares/nodeCache')
const { console } = require('inspector')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/images/users')
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
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

const deleteUploadedFile = (file) => {
    if (file) {
        const filePath = path.join(__dirname, '../../public/images/users', file.filename)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}

const deleteOldPhoto = (oldPhotoFilename) => {
    if (oldPhotoFilename && oldPhotoFilename !== 'default.png') {
        const filePath = path.join(__dirname, '../../public/images/users', oldPhotoFilename)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}

router.get('/user/profile/:profileId', verifyToken, authorize(['user']), async (req, res, next) => {
    const userId = req.user.id
    const {profileId} = req.params

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            return res.status(404).json({ message: 'User not found'})
        }

        const checkProfileId = await userModel.getUserById(profileId)
        if (checkProfileId.length == 0) {
            return res.status(404).json({ message: 'Profile not found'})
        }

        const profile = await userModel.profileUserById(profileId)
        const recipeProcess = await userModel.recipeProcess(profileId)
        const recipeReject = await userModel.recipeReject(profileId)
        const recipePublish = await userModel.recipePublish(userId, profileId)
        if (profileId == userId) {
            responseObject ={profile, recipePublish, recipeProcess, recipeReject, is_owner: true}
        } else if (profileId != userId) {
            responseObject ={profile, recipePublish, is_owner: false}
        }

        res.status(200).json(responseObject)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.patch('/user/profile/:profileId', verifyToken, authorize(['user']), upload.single('profile_photo'), async (req, res, next) => {
    const userId = req.user.id
    const {profileId} = req.params
    const {username, nickname, bio} = req.body

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            deleteUploadedFile(req.file)
            return res.status(404).json({ message: 'User not found'})
        }

        const profile_photo = req.file ? req.file.filename : checkUserId[0].photo_profile

        const checkProfileId = await userModel.getUserById(profileId)
        if (checkProfileId.length == 0) {
            deleteUploadedFile(req.file)
            return res.status(404).json({ message: 'Profile not found'})
        }

        if (profileId != userId) {
            deleteUploadedFile(req.file)
            return res.status(403).json({ message: 'Cannot udpate profile'})
        }

        if (/\s/.test(username)) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Username cannot have spaces.' })
        }
        if (!/^[a-zA-Z0-9._]+$/.test(username)) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Username can only contain letters, numbers, dots, and underscores.' })
        }
        if (/^\d+$/.test(username)) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Username cannot be only numbers.' })
        }
        if (/\.\./.test(username)) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Username cannot have consecutive dots.' })
        }
        if (username.endsWith('.')) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Username cannot end with a dot.' })
        }
        if (username.length < 1 || username.length > 30) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Username must be between 1 and 30 characters.' })
        }

        const usersWithSameUsername = await userModel.getByUsernameToUpdate(username, userId)
        if (usersWithSameUsername.length > 0) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Username already exists.' })
        }

        await userModel.updateProfile(username, nickname, profile_photo, bio, userId)

        if (req.file) deleteOldPhoto(checkUserId[0].photo_profile)
        console.log(checkUserId[0].photo_profile)

        res.status(200).json({message: 'OK'})
    } catch (e) {
        deleteUploadedFile(req.file)
        res.status(500).json({ message: e.message })
    }
})

router.patch('/user/profile/change_email/:profileId', verifyToken, authorize(['user']), async (req, res, next) => {
    const userId = req.user.id
    const {profileId} = req.params
    const {email, newEmail, confirmationEmail} = req.body

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            deleteUploadedFile(req.file)
            return res.status(404).json({ message: 'User not found'})
        }

        const checkProfileId = await userModel.getUserById(profileId)
        if (checkProfileId.length == 0) {
            deleteUploadedFile(req.file)
            return res.status(404).json({ message: 'Profile not found'})
        }
        
        if (profileId != userId) {
            deleteUploadedFile(req.file)
            return res.status(403).json({ message: 'Cannot udpate profile'})
        }

        if (checkProfileId[0].email != email) {
            deleteUploadedFile(req.file)
            return res.status(404).json({ message: 'Your email is wrong'})
        }

        if (newEmail != confirmationEmail) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Email and confirmation email do not match.' })
        }

        const usersWithSameEmail = await userModel.getByEmailToUpdate(newEmail, userId)
        if (usersWithSameEmail.length > 0) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Email already exists.' })
        }

        await userModel.updateEmailProfile(newEmail, userId)

        res.status(200).json({message: 'OK'})
    } catch (e) {
        deleteUploadedFile(req.file)
        res.status(500).json({ message: e.message })
    }
})

router.patch('/user/profile/change_password/:profileId', verifyToken, authorize(['user']), async (req, res, next) => {
    const userId = req.user.id
    const {profileId} = req.params
    const {password, newPassword, confirmationPassword} = req.body

    try {
        const checkUserId = await userModel.getUserById(userId)
        if (checkUserId.length == 0) {
            deleteUploadedFile(req.file)
            return res.status(404).json({ message: 'User not found'})
        }

        const checkProfileId = await userModel.getUserById(profileId)
        if (checkProfileId.length == 0) {
            deleteUploadedFile(req.file)
            return res.status(404).json({ message: 'Profile not found'})
        }
        
        if (profileId != userId) {
            deleteUploadedFile(req.file)
            return res.status(403).json({ message: 'Cannot udpate profile'})
        }

        const isMatch = await bcrypt.compare(password, checkProfileId[0].password)
        if (!isMatch) {
            deleteUploadedFile(req.file)
            return res.status(404).json({ message: 'Your password is wrong'})
        }

        if (newPassword != confirmationPassword) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Password and confirmation password do not match.' })
        }

        if (newPassword.length < 6) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Password must be at least 6 characters.' })
        }
        if (!/[A-Z]/.test(newPassword)) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Password must have at least one uppercase letter.' })
        }
        if (!/[a-z]/.test(newPassword)) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Password must have at least one lowercase letter.' })
        }
        if (!/\d/.test(newPassword)) {
            deleteUploadedFile(req.file)
            return res.status(400).json({ message: 'Password must contain at least one number.' })
        }

        await userModel.updatePasswordProfile (newPassword, userId)

        res.status(200).json({message: 'OK'})
    } catch (e) {
        deleteUploadedFile(req.file)
        res.status(500).json({ message: e.message })
    }
})

module.exports = router
