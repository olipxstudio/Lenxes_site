const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const SocialScheme = new Schema({
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    site:{
        type: Schema.Types.ObjectId,
        refPath: 'item_type'
    },
    site_type: {
        type: String,
        enum: ['Store', 'Site'],
        required: true
    },
    social_name:{
        type: String,
        lowercase: true
    },
    social_link:{
        type: String,
        lowercase: true
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


module.exports = model('Social', SocialScheme)