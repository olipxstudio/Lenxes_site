const express = require('express')
const router = express.Router()

// This would take user ID, follower ID, date and time and CREATE new row in follow table
router.post('/', (req, res) => {
    res.send('To follow an account')
})


module.exports = router