const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const DiscussMemberSchema = new Schema(
    {
        discuss: {
            type: SchemaTypes.ObjectId,
            ref:'Discuss',
            required: true
        },
        user: {
            type: SchemaTypes.ObjectId,
            ref:'User',
            required: true
        },
        date_added:{
            type: Date,
            default:()=>Date.now()
        },
        status: {
            type: String,
            default: 'active'
        }
    },
    {
        versionKey: false,
    }
);

module.exports = model("DiscussMember", DiscussMemberSchema);
