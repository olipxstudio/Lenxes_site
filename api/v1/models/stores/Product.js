const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const ProductSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref:'User',
            required: true
        },
        store: {
            type: SchemaTypes.ObjectId,
            ref:'Store',
            required: true
        },
        sku:{
            type: String,
            default: '001'
        },
        title:{
            type: String
        },
        photos:{
            thumb_one:{
                type: String,
                default:null
            },
            thumb_two:{
                type: String,
                default:null
            },
            thumb_three:{
                type: String,
                default:null
            },
            thumb_four:{
                type: String,
                default:null
            },
        },
        description:{
            type: String
        },
        category:{
            type: String
        },
        sub_category:{
            type: String
        },
        sub_set_category:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
        ccc:{
            type: String
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("Product", ProductSchema);
