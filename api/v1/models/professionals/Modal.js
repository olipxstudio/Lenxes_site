const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const ModalScheme = new Schema({
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    site: {
        type: SchemaTypes.ObjectId,
        ref: "Site",
        required: true,
    },
    screen:{
        type: SchemaTypes.ObjectId,
        ref: "Nav",
        required: true,
    },
    widget:{
        type: SchemaTypes.ObjectId,
        ref: "Sitebody",
        required: true,
    },
    title:{
        type: String,
        default: 'Modal Title'
    },
    subtitle:{
        type: String,
        default: 'Modal Subtitle'
    }
},
{
    timestamps: true,
    versionKey: false
}
)


module.exports = model('Modal', ModalScheme)