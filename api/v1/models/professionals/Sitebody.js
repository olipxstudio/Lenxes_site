const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;

const SitebodySchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        site: {
            type: SchemaTypes.ObjectId,
            ref: "Site",
            required: true,
        },
        screen:{
            type: SchemaTypes.ObjectId,
            ref: "Nav",
            required: true,
        },
        show_on:{
            page:{
                type: Boolean
            },
            modal:{
                type: SchemaTypes.ObjectId,
                ref: 'Modal'
            }
        },
        order:{
            type: Number
        },
        type:{
            type: String
            // banner, skillset, experience, projects, text, links, video, team, testimonials, values, connect, downloadable, partners, stats, hcards, section, services
        },
        title:{
            text:{
                type: String
            },
            colour:{
                type: String,
                default: '#000000'
            }
        },
        sub_title:{
            type: String,
        },
        social:{
            type: Boolean,
            default: false
        },
        model:{
            type: String,
            default: 'one'
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
        },
        banner: {
            type:{
                type: String // text, banner
            },
            photo:{
                type:{
                    type: String,
                    default: 'internal' // internal / external
                },
                url:{
                    type: String
                },
                height:{
                    type: String,
                    default: 'normal' //normal / large
                },
            },
            decor_title:{
                text:{
                    type: String
                },
                colour:{
                    type: String,
                    default: 'inherite' // inherite primary colour or set
                },
                font_family:{
                    type: String,
                    default: 'Normal'
                },
            },
            properties:{
                font_size:{
                    type: String, // small, medium, large
                    default: 'medium' // can apply to title on banner
                },
                colour:{
                    type: String,
                    default: '#000000'
                },
                font_family:{
                    type: String,
                    default: 'Normal'
                },
                case:{
                    type: String,
                    default: 'titled' // can apply to title on banner
                }
            }
        },
        skillset:[ // skillset / languages
            {
                type: Array,
                title:{
                    type: String
                },
                years:{
                    type: String
                },
                level:{
                    type: String
                }
            }
        ],
        experience:[ // experience / education
            {
                type: Array,
                workplace:{
                    type: String
                },
                duties:{
                    type: String
                },
                from:{
                    type: String
                },
                to:{
                    type: String
                }
            }
        ],
        past_projects:[
            {
                type: Array,
                photo:{
                    type: String
                },
                name:{
                    type: String
                },
                for:{ // for who / type (e.g. UI / UX)
                    type: String
                },
                link:{
                    type: String
                }
            }
        ],
        partners:[
            {
                type: Array,
                text:{
                    type: String
                },
                logo:{
                    type: String
                }
            }
        ],
        stats:[
            {
                type: Array,
                number:{
                    type: String,
                },
                description:{
                    type: String
                }
            }
        ],
        card:[
            {
                type: Array,
                photo:{
                    type: String
                },
                title:{
                    type: String
                },
                description:{
                    type: String
                }
            }
        ],
        team:[
            {
                type: Array,
                user:{
                    type: SchemaTypes.ObjectId,
                    ref: 'User'
                },
                position:{
                    type: String
                }
            }
        ],
        testimonial:[
            {
                type: Array,
                testifier:{
                    type: SchemaTypes.ObjectId,
                    ref: 'User'
                },
                testimony:{
                    type: String
                },
                status:{
                    type: String,
                    default: 'hidden'
                }
            }
        ],
        links:[
            {
                type: Array,
                anchor:{
                    type: String
                },
                url:{
                    type: String
                }
            }
        ],
        services:[
            {
                type: Array,
                photo:{
                    type: String
                },
                title:{
                    type: String
                },
                descripion:{
                    type: String
                }
            }
        ],
        core_value:[
            {
                type: Array,
                title:{
                    type: String
                },
                text:{
                    type: String
                }
            }
        ],
        text:{
            type: String
        },
        connect:{
            type: Boolean
        },
        downloadable:{
            type: String // PDF
        },
        section:{
            file:{
                type: String
            },
            type:{
                type: String // photo, video
            }
        },
        video:{
            type: String
        },
        status: {
            type: String,
            default: 'active'
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("Sitebody", SitebodySchema);
