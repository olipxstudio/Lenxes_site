const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const NicheSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: null
    },
    private:{
        type: Boolean,
        default: false
    },
    question:{
        type: Boolean,
        default: true
    },
    creator:{
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    followers_count:{
        type: Number,
        default: 0
    },
    members_count:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        default: 'pending'
    }
},
{
    timestamps: true,
    versionKey: false
})

module.exports = model('Niche', NicheSchema)