const express = require('express')
const router = express.Router()
const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const limiter = require('../middlewares/ratelimiter')
const jwt = require('jsonwebtoken')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/users'))
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
        const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
        )
        if (mimetype && extname) {
        cb(null, true)
        } else {
        cb(new Error('Only image files (jpeg, jpg, png) are allowed'))
        }
    }
})

const deleteUploadedFile = (file) => {
    if (file) {
        const filePath = path.join(__dirname, '../public/images/users', file.filename)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
}

router.post('/register', upload.single('profile_photo'), async (req, res) => {
    const { username, nickname, email, password, confirmationPassword} = req.body
    const photoProfile = req.file ? req.file.filename : 'default.png'

    if (!username) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Username is required.' })
    }
    if (!email) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Email is required.' })
    }
    if (!password) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Password is required.' })
    }
    if (!confirmationPassword) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Confirmation password is required.' })
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

    const checkUser = await userModel.getByUsername(username)
    if (checkUser.length > 0) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Username already exists.' })
    }

    const checkEmail = await userModel.getByEmail(email)
    if (checkEmail.length > 0) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Email already exists.' })
    }

    if (password.length < 6) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }
    if (!/[A-Z]/.test(password)) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Password must have at least one uppercase letter.' })
    }
    if (!/[a-z]/.test(password)) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Password must have at least one lowercase letter.' })
    }
    if (!/\d/.test(password)) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Password must contain at least one number.' })
    }
    if (password !== confirmationPassword) {
        deleteUploadedFile(req.file)
        return res.status(400).json({ message: 'Password and confirmation password do not match.' })
    }

    try {
        await userModel.registerUser(photoProfile, username, nickname, email, password)
        res.status(201).json({ message: 'OK'})
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
    })

    router.post('/login', limiter, async (req, res) => {
    const { email, password } = req.body
    if (!email)
        return res.status(400).json({ message: 'Email is required.' })
    if (!password)
        return res.status(400).json({ message: 'Password is required.' })

    try {
        let user = await userModel.login(email, password)
        let userType = null
        if (user) {
        userType = 'user'
        } else {
        user = await adminModel.login(email, password)
        if (user) {
            userType = 'admin'
        } else {
            return res.status(403).json({ message: 'Email not found.' })
        }
        }
        res.status(200).json({ token: user.token, userType })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.post('/logout', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
        return res.status(401).json({ message: 'Token invalid.' })
        }
        res.status(200).json({ message: 'Logout successful.' })
    })
})

module.exports = router
