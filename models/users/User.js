const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = new Schema({
    fullname: String,
    email: String,
    phone: Number,
    profession: String,
    password: String,
    country: String,
    state: String,
    city: String,
    address: String,
    photo: String,
    bio: String,
    category: String,
    uri: String,
    status: String
})

module.exports = mongoose.model('User', User)