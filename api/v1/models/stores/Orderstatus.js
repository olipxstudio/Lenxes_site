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
    store: {
        type: SchemaTypes.ObjectId,
        ref:'Store',
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
        type: String // parcel (provided through notification), delivery, pickup (from store), online (for digital)
    },
    delivery_id:{
        type: SchemaTypes.ObjectId,
        ref: 'Delivery'
    },
    delivery_token:{
        buyer:{
            type: String
        },
        seller:{
            type: String // show in various formats (e.g. --**--**, **--**--, ****----, ----****, *-*-*-*-, -*-*-*-*, **----**, --****--)
        }
    },
    transaction_id:{
        type: String
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


module.exports = model('Orderstatus', OrderstatusScheme)