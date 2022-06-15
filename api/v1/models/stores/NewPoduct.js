const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;

const ProductSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    // product name
    name: {
      type: String,
      required: true,
    },
    // product description
    description: {
      type: String,
      required: true,
    },
    // product price
    price: {
      type: Number,
      required: true,
    },
    // product category type is object
    category: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    // product subcategory type is object
    subcategory: {
      type: SchemaTypes.ObjectId,
      ref: "Subcategory",
    },
    // product subsubcategory type is object
    subsubcategory: {
      type: SchemaTypes.ObjectId,
      ref: "Subsubcategory",
    },
    // product condition type string
    condition: {
      type: String,
      required: true,
      default: "new",
    },
    // featured product type boolean
    featured: {
      type: Boolean,
      default: false,
    },
    // product image type is array
    image: [
      {
        type: String,
        required: true,
      },
    ],
    qunatity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },

    // product variants type is array
    variants: [
      {
        type: Array,
        size: {
          type: Array,
          default: [],
        },
        color: {
          type: Array,
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
              qunatity: {
                type: Number,
              },
              price: {
                type: Number,
              },
            },
          ],
        },
      },
    ],
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

module.exports = model("Product", ProductSchema);
