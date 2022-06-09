const mongoose = require('mongoose')
const { model, SchemaTypes, Schema } = mongoose

const LikeScheme = new Schema({
    post_id:{
        type: SchemaTypes.ObjectId,
        ref:'Post',
        required: true,
        immutable: true
    },
    post_type:{
        type: String,
        lowercase: true
    },
    post_owner_id:{
        type: SchemaTypes.ObjectId,
        ref:'User',
        required: true,
        immutable: true
    },
    liker_id:{
        type: SchemaTypes.ObjectId,
        ref:'User',
        required: true,
        immutable: true
    },
    status:{
        type: String,
        default: 'active'
    }
},
{
    versionKey: false,
    timestamps: true
}
)

module.exports = model('Like', LikeScheme)