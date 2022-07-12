const mongoose = require('mongoose')
const {Schema, SchemaTypes, model} = mongoose

const StoreStructureScheme = new Schema({
    store:{
        type: SchemaTypes.ObjectId,
        ref: 'Store',
        required: true
    },
    about:{
        description:{
            types: String,
        },
        product_types:[
            {
                type: Array,
                type_id:{
                    type: SchemaTypes.ObjectId,
                    ref: 'ProductType'
                }
            }
        ]
    },
    hero:{
        enabled:{
            types: Boolean
        },
        model:{
            types: String //one, two, three etc
        },
        properties:{
            photos:[{
                type: String
            }],
            photo_type:{
                type: String // internal / external
            },
            heading_one:{
                title:{
                    type: String
                },
                fontface:{
                    type: String
                },
                colour:{
                    type: String
                }
            },
            heading_two:{
                title:{
                    type: String
                },
                fontface:{
                    type: String
                },
                colour:{
                    type: String
                }
            },
            subheading:{
                title:{
                    type: String
                },
                fontface:{
                    type: String
                },
                colour:{
                    type: String
                }
            }
        },
        call_to_action:{
            enabled:{
                type: Boolean,
                default: false
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
        }
    },
    category:{
        model:{
            type: String
        },
        fontface:{
            type: String // This is applied to the title in each category page and not the category menu
        }
    },
    banners:{
        enabled:{
            types: Boolean
        },
        model:{
            types: String //one, two, three etc
        },
        properties:{
            photo:{
                type: String
            },
            photo_type:{
                type: String // internal / external
            },
            heading:{
                title:{
                    type: String
                },
                fontface:{
                    type: String
                },
                colour:{
                    type: String
                }
            },
            subheading:{
                type: String
            }
        },
        call_to_action:{
            enabled:{
                type: Boolean,
                default: false
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
        }
    }
},
{
    timestamps: true,
    versionKey: false
}
)


module.exports = model('Store_Structure', StoreStructureScheme)