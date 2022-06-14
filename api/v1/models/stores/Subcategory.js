const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const SubCategoryScheme = new Schema({
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    store:{
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    name: {
        type: String,
        lowercase:true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    has_set:{
        type: String,
        default: 'no',
        lowercase: true
        // yes / no
    },
    status:{
        type: String,
        default: 'active'
    }
},
{
    timestamps: true,
    versionKey: false
}
)


module.exports = model('Subcategory', SubCategoryScheme)