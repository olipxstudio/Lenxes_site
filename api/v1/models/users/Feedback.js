const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const FeedbackSchema = new Schema({
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    feedback:{
        type: String
    },
    status:{
        type: String,
        default: 'unseen'
    }
},
{
    versionKey: false
})

module.exports = model("Feedback", FeedbackSchema)