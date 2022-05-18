const express = require('express')
const router = express.Router()

// This would take fullname, email, phone, profession and CREATE new row
router.post('/', (req, res) => {
    res.send('The first signup page')
})

// This would take username, password and UPDATE user table
router.put('/account_security', (req, res) => {
    res.send('The user security')
})

// This would take profile photo, bio, category and UPDATE users table
router.post('/profile_details', (req, res) => {
    res.send('The user profile details')
})

// This would take country, state, city and street address and CREATE NEW address table adding user unique ID
router.post('/delivery_address', (req, res) => {
    res.send('The user delivery address')
})


module.exports = router