const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    try {
        res.status(200).json({ message: 'OK'})
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.log(err)
    }
})

module.exports = router