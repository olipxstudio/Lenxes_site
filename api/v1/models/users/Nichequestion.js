const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const NicheQuestionSchema = new Schema({
    question:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        default: null
    },
    niche:{
        type: SchemaTypes.ObjectId,
        ref: 'Niche',
        required: true
    },
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    like_count:{
        type: Number,
        default: 0
    },
    comment_count:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        default: 'active'
    }
},
{
    timestamps: true,
    versionKey: false
})

module.exports = model('Nichequestion', NicheQuestionSchema)