const mongoose = require('mongoose')
const {Schema, model} = mongoose

const IndustriesSchema = new Schema({
    title:{
        type: String
    },
    status:{
        type: String,
        default: 'active'
    }
},
{
    versionKey: false
})

module.exports = model("Social_industry", IndustriesSchema)