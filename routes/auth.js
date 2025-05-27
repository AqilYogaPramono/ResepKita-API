const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
const multer = require('multer');
const path = require('path');
const limiter = require('../middlewares/ratelimiter');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/users'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png) are allowed'));
    }
  }
});

router.post('/register', upload.single('profile_photo'), async (req, res) => {
  const { username, nickname, email, password, confirmationPassword} = req.body;
  const photoProfile = req.file ? req.file.filename : 'default.png';

  if (!username)
    return res.status(400).json({ message: 'Username is required.' });
  if (!nickname)
    return res.status(400).json({ message: 'Nickname is required.' });
  if (!email)
    return res.status(400).json({ message: 'Email is required.' });
  if (!password)
    return res.status(400).json({ message: 'Password is required.' });
  if (!confirmationPassword)
    return res.status(400).json({ message: 'Confirmation password is required.' });

  try {
    const checkUser = await userModel.getByUsername(username);
    if (checkUser)
      return res.status(400).json({ message: 'Username already exists.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  try {
    const checkEmail = await userModel.getByEmail(email);
    if (checkEmail)
      return res.status(400).json({ message: 'Email already exists.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters.' });
  if (!/[A-Z]/.test(password))
    return res
      .status(400)
      .json({ message: 'Password must have at least one uppercase letter.' });
  if (!/[a-z]/.test(password))
    return res
      .status(400)
      .json({ message: 'Password must have at least one lowercase letter.' });
  if (!/\d/.test(password))
    return res
      .status(400)
      .json({ message: 'Password must contain at least one number.' });
  if (password !== confirmationPassword)
    return res.status(400).json({
      message: 'Password and confirmation password do not match.'
    });

  try {
    const registerResult = await userModel.registerUser(photoProfile, username, nickname, email, password);
    res.status(201).json({ message: 'OK'});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
