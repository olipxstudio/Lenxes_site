const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const CommentSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref:'User',
            required: true
        },
        post: {
            type: SchemaTypes.ObjectId,
            ref:'Discuss',
            required: true
        },
        text: {
            type: String,
            default: null
        },
        photo:{
            type: String,
            default: null
        },
        tagged_product:{
            type: SchemaTypes.ObjectId,
            ref: 'Product',
            required: false
        },
        replied_to: {
            type: SchemaTypes.ObjectId,
            ref: 'Comment',
            required: false
        },
        replied_under: {
            type: SchemaTypes.ObjectId,
            ref: 'Comment',
            required: false
        },
        has_replies:{
            type: String,
            default: 'no'
            // yes or no
        },
        status: {
            type: String,
            default: 'active'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("Comment", CommentSchema);
