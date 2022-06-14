const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const FollowSchema = new Schema({
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    follow:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    date:{
        type: Date,
        default: () => Date.now()
    },
    status:{
        type: String,
        default: 'active'
    }
},
{
    versionKey: false
}
)


module.exports = model('Follow', FollowSchema)