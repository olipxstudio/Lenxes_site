const mongoose = require('mongoose')

const Post = new mongoose.Schema({
    user: {
        type: String,
        default: null
    },
    post: {
        type: String,
        default: null
    },
    tag_product: {
        type: Number,
        default: null
    },
    linking: {
        type: String,
        default: null
    },
    posted_from: {
        type: String,
        default: null
    },
    caption: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    comment_permission: {
        type: String,
        default: null
    },
    post_type: {
        type: String
    },
    identifier: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
    }
},
{
  timestamps: true,
  versionKey: false,
}
)

module.exports = mongoose.model('Post', Post)
