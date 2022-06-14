const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const DiscussChatNotifyScheme = new Schema({
    discuss:{
        type: SchemaTypes.ObjectId,
        ref: 'Discuss',
        required: true
    },
    receiver:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    count:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        default: 'unread',
        lowercase: true
    },
},
{
    timestamps: true,
    versionKey: false
}
)


module.exports = model('DiscussChatNotify', DiscussChatNotifyScheme)