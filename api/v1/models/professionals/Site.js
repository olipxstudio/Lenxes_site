const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const SiteScheme = new Schema({
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    business_name:{
        type: String,
    },
    motto:{
        type: String,
    },
    location:{
        type: String,
        // location / online
    },
    address:{
        type: String,
    },
    phone:{
        type: String,
    },
    email:{
        type: String,
    },
    employee_size:{
        type: String,
    },
    access_pin:{
        type: String,
        default: '0000'
    },
    policy:{
        title:{
            type: String,
            default: 'Policy'
        },
        body:{
            type: String,
        }
    },
    business_type:{
        type: String
        // starter / registered
    },
    verification:{
        type:{
            type: String,
            // BVN, Drivers License, Voters Card, NIN, International Passport, Reg Certificate
        },
        front_photo:{
            type: String,
        },
        back_photo:{
            type: String,
        },
        id:{
            type: String,
        }
    },
    call_to_action:{
        message:{
            type: String
        },
        enabled:{
            type: Boolean,
            default: true
        },
        anchor:{
            type: String
        },
        type:{
            type: String
            // modal / external / page
        },
        onclick:{
            link:{
                type: String
            },
            screen:{
                type: SchemaTypes.ObjectId,
                ref: 'Nav'
            },
            modal:{
                type: SchemaTypes.ObjectId,
                ref: 'Modal'
            }
        }
    },
    status:{
        type: String,
        default: 'pending',
        lowercase: true
    },
},
{
    timestamps: true,
    versionKey: false
}
)


module.exports = model('Site', SiteScheme)