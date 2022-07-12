const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const PayoutPercentScheme = new Schema({
    local_fess:{
        type: Number
    },
    international_fee:{
        type: Number
    }
},
{
    timestamps: true,
    versionKey: false
}
)


module.exports = model('AdminPayoutpercent', PayoutPercentScheme)