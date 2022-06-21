const req = require('express/lib/request')
const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const NavScheme = new Schema({
    name:{
        type: String,
        lowercase: true
    },
    site:{
        type: SchemaTypes.ObjectId,
        ref: 'Site',
        required: true,
    },
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    order:{
        type: Number
    },
    status:{
        type: String,
        default: 'enabled' // enabled / disabled
    }
},
{
    versionKey: false
}
)


module.exports = model('Nav', NavScheme)