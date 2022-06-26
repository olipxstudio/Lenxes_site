const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const OrderstatusScheme = new Schema({
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
    channel: {
        type: String // card, offline, transfer
    },
    payment_status:{
        type: String // not / paid
    },
    amount:{
        type: Number
    },
    shipping:{
        type: Number
    },
    discount_percent:{
        type: Number
    },
    discounted_amount:{
        type: Number
    },
    coupon_id:{
        type: SchemaTypes.ObjectId,
        ref: 'Coupon'
    },
    total_amount:{
        type: Number
    },
    delivery_method:{
        type: String // shipping, pickup, online
    },
    delivery_id:{
        type: SchemaTypes.ObjectId,
        ref: 'Delivery'
    },
    delivery_token:{
        type: String
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


module.exports = model('Orderstatus', OrderstatusScheme)