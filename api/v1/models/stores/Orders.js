const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const OrdersScheme = new Schema({
    product_details: {
        product: {
            type: SchemaTypes.ObjectId,
            ref:'Product',
            required: true
        },
        variant:{
            type: SchemaTypes.ObjectId,
        },
        variant_item:{
            type: SchemaTypes.ObjectId,
        }
    },
    buyer:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    seller:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    store: {
        type: SchemaTypes.ObjectId,
        ref:'Store',
        required: true
    },
    quantity: {
        type: Number
    },
    order_status_id:{
        type: SchemaTypes.ObjectId,
        ref:'Orderstatus',
        required: true
    },
    transaction_id:{
        type: String
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
    status:{
        type: String,
        default: 'paid' // paid, declined, completed
    },
    date:{
        type: Date,
        default: () => Date.now()
    }
},
{
    versionKey: false
}
)


module.exports = model('Order', OrdersScheme)