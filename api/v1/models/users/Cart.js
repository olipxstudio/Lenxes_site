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
            type: Boolean, // if true and fee is 0 then free delivery
            default: false
        },
        type:{
            type: String, // home / pickup
            default: 'home'
        },
        pickup_location:{
            type: String,
            default: null
        },
        fee:{
            type: Number,
            default: 0
        },
        duration:{
            type: String
        },
        instruction:{
            type: String,
            default: null
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
