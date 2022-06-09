const mongoose = require('mongoose')
const {SchemaTypes, Schema, model} = mongoose

const SavedSchema = new Schema({
    post_id: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'Post'
    },
    user: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    post_owner_id: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        default: () => Date.now()
    }
},
{
    versionKey: false
})

module.exports = model('Saved', SavedSchema)