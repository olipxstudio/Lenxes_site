const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const NicheFollowSchema = new Schema({
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    follow:{
        type: SchemaTypes.ObjectId,
        ref: 'Niche',
        required: true
    },
    date:{
        type: Date,
        default: () => Date.now()
    },
},
{
    versionKey: false
}
)


module.exports = model('Nichefollow', NicheFollowSchema)