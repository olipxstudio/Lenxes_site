const mongoose = require('mongoose')
const {Schema, model} = mongoose

const NewWidgetScheme = new Schema({
    name:{
        type: String,
    },
    model:{
        type: String,
    },
    calltoaction:{
        type: Boolean
    },
    status:{
        type: String,
        default: 'active',
        lowercase: true
    },
},
{
    versionKey: false
}
)


module.exports = model('Widget', NewWidgetScheme)