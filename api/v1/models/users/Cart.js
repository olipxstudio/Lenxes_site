const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const CartSchema = new Schema(
  {
    user: {
        type: SchemaTypes.ObjectId,
        ref:'User',
        required: true
    },
    collection_id: {
        type: SchemaTypes.ObjectId,
        ref:'Cartcollection',
        required: true
    },
    product: {
        type: SchemaTypes.ObjectId,
        ref:'Product',
        required: true
    },
    store: {
        type: SchemaTypes.ObjectId,
        ref:'Store',
        required: true
    },
    quantity:{
        type: Number
    },
    address:{
        type: SchemaTypes.ObjectId
    },
    delivery:{
        payment_set:{
            type: Boolean, // charged / free - charged is false, while free is true
            default: false
        },
        type:{
            type: String, // home / pickup
            default: 'home'
        },
        fee:{
            type: Number,
            default: 0
        },
        instruction:{
            type: String
        }
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

module.exports = model("Cart", CartSchema);
