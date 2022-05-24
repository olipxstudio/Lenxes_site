

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    fullname: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please enter a valid email address"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Please enter a valid phone"],
    },
    profession:{
        type: String,
    },
    address: {
      name: {
        type: String,
        default: null
      },
      address_line1: {
        type: String,
        default: null
      },
      address_line2: {
        type: String,
        default: null
      },
      country: {
        type: String,
        default: null
      },
      country_code: {
        type: String,
        default: null
      },
      lga: {
        type: String,
        default: null
      },
      formatted: {
        type: String,
        default: null
      },
      lat: {
        type: Number,
        default: null
      },
      lon: {
        type: Number,
        default: null
      },
      address_type: {
        type: String,
        default: null
      },
      state: {
        type: String,
        default: null
      },
      state_code: {
        type: String,
        default: null
      },
    },
  
    password: {
      type: String,
    },
    status: {
      type: String,
    },
    photo:{
        type: String,
    },
    bio:{
        type: String,
    },
    category:{
        type: String,
    },
    uri:{
        type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  });

UserSchema.statics.encryptPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };
  
  UserSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
  };
  
  module.exports = mongoose.model("User", UserSchema);