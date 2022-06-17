const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;

const NewProductSchema = new Schema(
{
    // name: [
    //     {
    //         type: String
    //     },
    // ]
    name: [
        {
            color_name: {
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
    ]
},
{
    versionKey: false
}
);

module.exports = model("Newproduct", NewProductSchema);
