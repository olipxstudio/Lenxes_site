const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const CartCollectionSchema = new Schema(
  {
    user: {
        type: SchemaTypes.ObjectId,
        ref:'User',
        required: true
    },
    name: {
        type: String
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

module.exports = model("Cartcollection", CartCollectionSchema);
