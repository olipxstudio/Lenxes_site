const mongoose = require("mongoose")
const {Schema, SchemaTypes, model} = mongoose

const DiscussSchema = new Schema(
  {
    creator: {
      type: SchemaTypes.ObjectId,
      ref:'User',
      required: true
    },
    discuss_item: {
        type: SchemaTypes.ObjectId,
        refPath:'type',
    },
    type:{
        type: String,
        enum: ['Post', 'Product', 'Jive', 'Question'],
        required: true
        // product, post, question, jive
    },
    members_count:{
        type: Number,
        default: 0
    },
    time_remaining: {
      type: Date,
      default: () => Date.now()
    },
    status: {
      type: String,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Discuss", DiscussSchema);
