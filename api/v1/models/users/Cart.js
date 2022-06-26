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
    delivery:{
        type:{
            type: String, // charged / free
            default: 'charged'
        },
        home:{
            type: Number,
            default: 0
        },
        pickup:{
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
