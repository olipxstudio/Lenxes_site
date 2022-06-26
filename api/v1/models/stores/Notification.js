const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const StoreNotificationScheme = new Schema({
    sender:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    receiver:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    store:{
        type: SchemaTypes.ObjectId,
        ref: 'Store',
        required: true
    },
    type:{
        type: String, // delivery, enquiry, favourite, order
        required: true
    },
    delivery:{
        product:{
            type: SchemaTypes.ObjectId,
            ref: 'Product',
        },
        location:{
            type: String
        },
        cart_id:{
            type: SchemaTypes.ObjectId,
            ref: 'Cart'
        }
    },
    enquiry:{
        product:{
            type: SchemaTypes.ObjectId,
            ref: 'Product',
        },
        message:[
            {
                text:{
                    type: String
                },
                sender:{
                    type: SchemaTypes.ObjectId,
                    ref: 'User',
                }
            }
        ]
    },
    favourite:{
        type: Boolean,
        default: false
    },
    order:{
        type: SchemaTypes.ObjectId,
        ref: 'Orderstatus'
    },
    status:{
        type: String,
        default: 'unread'
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


module.exports = model('StoreNotification', StoreNotificationScheme)