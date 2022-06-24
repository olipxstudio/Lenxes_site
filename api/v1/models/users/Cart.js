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
    owner: {
        type: SchemaTypes.ObjectId,
        ref:'User',
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
