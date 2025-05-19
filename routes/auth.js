var express = require('express');
const userModel = require('../models/userModel');
var router = express.Router();

router.get('/test', async (req, res) => {
  try {
    const { email } = req.body
    getUseranme = await userModel.getUserByUserName(email)

    res.status(200).json({ getUseranme })

  } catch (err) {
    res.status(500).json({ message: err.message})
  }
})

module.exports = router;
