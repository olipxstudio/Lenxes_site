const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const DiscussChatSchema = new Schema(
  {
    user: {
        type: SchemaTypes.ObjectId,
        ref:'User',
        required: true
    },
    discuss: {
        type: SchemaTypes.ObjectId,
        ref:'Discuss',
        required: true
    },
    photo: {
        type: String,
        default: null
    },
    audio:{
        type: String,
        default: null
    },
    text:{
        type: String,
        default: null
    },
    replied_to: {
        type: SchemaTypes.ObjectId,
        ref: 'Discusschat'
    },
    attached_type:{
        type: String
    },
    attached:{
        post:{
            type: SchemaTypes.ObjectId,
            ref: 'Post'
        },
        product:{
            type: SchemaTypes.ObjectId,
            ref: 'Product'
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

module.exports = model("Discusschat", DiscussChatSchema);
