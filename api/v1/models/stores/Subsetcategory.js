const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const SubSetCategoryScheme = new Schema({
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
    subcategory:{
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
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


module.exports = model('Subsetcategory', SubSetCategoryScheme)