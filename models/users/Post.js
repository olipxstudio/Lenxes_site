const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    // posted by
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post_meta: {
      image: {
        type: String,
        default: null,
      },
      video: {
        type: String,
        default: null,
      },
      thumbnail: {
        type: String,
        default: null,
      },
      text: {
        type: String,
        default: null,
      },
    },
    // tag multiple products
    tagged_product: {
      type: Array,
      default: null,
    },
    // is post from camera or gallery
    post_from: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      default: null,
    },
    // user shared location
    location: {
      type: String,
      default: null,
    },
    // comment permissions
    comment_permission: {
      type: String,
      default: "everyOneCanComment",
      // everyOneCanComment, onlyFollowersCanComment, onlyMeCanComment, noOneCanComment
    },
    // is post video, image or text
    post_type: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "draft",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Post", Post);
