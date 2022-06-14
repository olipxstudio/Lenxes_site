const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const CategoryScheme = new Schema({
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
    has_sub:{
        type: String,
        default: 'no',
        lowercase: true
        // yes / no
    },
    product_count:{
        type: Number,
        default:0
    },
    order:{
        type: Number,
        default:0
        // order categories by this column
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


module.exports = model('Category', CategoryScheme)