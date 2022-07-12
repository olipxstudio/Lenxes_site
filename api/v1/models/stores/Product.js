const mongoose = require("mongoose");
const { Schema, SchemaTypes, model, ObjectID } = mongoose;

// var ObjectID = require('mongodb').ObjectID;
// const Variant = new Schema(
//     {
//                 color_name: {
//                     type: String,
//                 },
//                 color_code: {
//                     type: String,
//                 },
//                 color_thumbnail: {
//                     type: String,
//                 },
//                 items: [
//                   {
//                     size: {
//                         type: String,
//                     },
//                     qunatity: {
//                         type: Number,
//                     },
//                     price: {
//                         type: Number,
//                     },
//                   },
//                 ],
//     }
// )

const ProductSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        store: {
            type: SchemaTypes.ObjectId,
            ref: "Store",
            required: true,
        },
        sku:{
            type: Number,
        },
        title:{
            type: String
        },
        photo: [
            {
                type: String,
                required: true,
            },
        ],
        description:{
            type: String,
        },
        category: {
            type: SchemaTypes.ObjectId,
            ref: "Category",
            required: true,
        },
        subcategory: {
            type: SchemaTypes.ObjectId,
            ref: "Subcategory",
        },
        subsetcategory: {
            type: SchemaTypes.ObjectId,
            ref: "Subsetcategory",
        },
        condition: {
            type: String,
            required: true,
            default: "new",
        },
        variants: [
            {
                color_name: {
                    type: String,
                },
                color_code: {
                    type: String,
                },
                color_thumbnail: {
                    type: String,
                },
                items: [
                    {
                        size: {
                            type: String,
                        },
                        price: {
                            type: Number,
                        },
                        quantity: {
                            type: Number,
                        }
                    },
                ],
            },
        ],
        featured: {
            type: Boolean,
            default: true,
        },
        attribute: {
            upc:{
                type: String
            },
            brand:{
                type: String
            }
        },
        related_products: [
            {
                type: SchemaTypes.ObjectId,
                ref: "Product",
            },
        ],
        customer_input: {
            type: Boolean,
            default: false
        },
        input_type: {
            type: String
            // text, file, both
        },
        stock_control: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            default: 'active'
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("Product", ProductSchema);
