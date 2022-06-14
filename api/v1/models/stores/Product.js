const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const ProductSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref:'User',
            required: true
        },
        status: {
            type: String,
            default: 'active'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("Product", ProductSchema);
