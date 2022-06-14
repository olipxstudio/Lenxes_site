const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const ShareSchema = new Schema(
    {
        sharer: {
            type: SchemaTypes.ObjectId,
            ref:'User',
            required: true
        },
        receiver: {
            type: SchemaTypes.ObjectId,
            ref:'Discuss',
            required: true
        },
        item: {
            type: [Schema.Types.ObjectId],
            refPath: 'item_type'
        },
        item_type: {
            type: String,
            enum: ['Post', 'Product', 'User'],
            required: true
        },
        date:{
            type: Date,
            default: () => Date.now()
        },
        status: {
            type: String,
            default: 'active'
        }
    },
    {
        versionKey: false,
    }
);

module.exports = model("Share", ShareSchema);
