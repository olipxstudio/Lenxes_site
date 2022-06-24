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