const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const OrdersScheme = new Schema({
    product:{
        type: SchemaTypes.ObjectId,
        ref: 'Product',
        required: true
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
        ref: 'Orderstatus',
        required: true
    },
    transaction_id:{
        type: String
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
    status:{
        type: String,
        default: 'pending'
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