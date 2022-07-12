const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const PayoutScheme = new Schema({
    store:{
        type: SchemaTypes.ObjectId,
        ref: 'Store',
        required: true
    },
    amount_due:{
        type: Number
    },
    settled_amount:{
        type: Number
    },
    batch:{
        type: Number
    },
    transaction_id:{
        type: String
    },
    date_due:{
        type: Date,
        default: () => Date.now()
    },
    date_paid:{
        type: Date,
    },
    status:{
        type: String,
        default: 'pending',
        lowercase: true
    },
},
{
    versionKey: false
}
)


module.exports = model('Payout', PayoutScheme)