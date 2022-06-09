const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const NotificationScheme = new Schema({
    identity:{
        post_id:{
            type: SchemaTypes.ObjectId,
            ref: 'Post',
            default: null
        },
        account_id:{
            type: SchemaTypes.ObjectId,
            ref: 'User',
            default: null
        },
    },
    sender:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    receiver:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    purpose:{
        type: String,
        lowercase: true,
        required: true
        // liked, commented, followed, messaged, discuss, membertoniche, invited, tagged
    },
    status:{
        type: String,
        default: 'unread',
        lowercase: true
    },
    init_on:{
        type: String,
        lowercase: true,
        required: true
        // post, account
    },
    init_date:{
        type: Date,
        default: () => Date.now()
    },
    read_date:{
        type: Date
    }
},
{
    versionKey: false
}
)


module.exports = model('Notification', NotificationScheme)