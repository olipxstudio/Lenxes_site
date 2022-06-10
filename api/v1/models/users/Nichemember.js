const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;

const NicheMemberSchema = new Schema(
  {
    niche: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "Niche",
    },
    member: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    niche_owner: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("NicheMember", NicheMemberSchema);
